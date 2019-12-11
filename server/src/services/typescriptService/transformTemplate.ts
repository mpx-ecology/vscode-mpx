import * as ts from "typescript";
import { AST } from "vue-eslint-parser";
import { T_TypeScript } from "../dependencyService";
import { walkExpression } from "./walkExpression";

export const renderHelperName = "__vlsRenderHelper";
export const componentHelperName = "__vlsComponentHelper";
export const iterationHelperName = "__vlsIterationHelper";

/**
 * Allowed global variables in templates.
 * Borrowed from: https://github.com/vuejs/vue/blob/dev/src/core/instance/proxy.js
 */
const globalScope = (
  "Infinity,undefined,NaN,isFinite,isNaN," +
  "parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent," +
  "Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl," +
  "require"
).split(",");

const vOnScope = ["$event", "arguments"];

type ESLintVChild = AST.VElement | AST.VExpressionContainer | AST.VText;

export function getTemplateTransformFunctions(ts: T_TypeScript) {
  return {
    transformTemplate,
    parseExpressionImpl
  };

  /**
   * Transform template AST to TypeScript AST.
   * Note: The returned TS AST is not compatible with
   * the regular Vue render function and does not work on runtime
   * because we just need type information for the template.
   * Each TypeScript node should be set a range because
   * the compiler may clash or do incorrect type inference
   * when it has an invalid range.
   */
  function transformTemplate(program: AST.ESLintProgram, code: string) {
    const template = program.templateBody;

    if (!template) {
      return [];
    }

    return transformChildren(template.children, code, globalScope);
  }

  /**
   * Transform an HTML to TypeScript AST.
   * It will be a call expression like Vue's $createElement.
   * e.g.
   * __vlsComponentHelper('div', { props: { title: this.foo } }, [ ...children... ]);
   */
  function transformElement(
    node: AST.VElement,
    code: string,
    scope: string[]
  ): ts.Expression {
    return ts.createCall(ts.createIdentifier(componentHelperName), undefined, [
      // Pass this value to propagate ThisType in listener handlers
      ts.createIdentifier("this"),

      // Element / Component name
      ts.createLiteral(node.name),

      // Attributes / Directives
      transformAttributes(node.startTag.attributes, code, scope),

      // Children
      ts.createArrayLiteral(transformChildren(node.children, code, scope))
    ]);
  }

  function transformAttributes(
    attrs: (AST.VAttribute | AST.VDirective)[],
    code: string,
    scope: string[]
  ): ts.Expression {
    interface AttributeData {
      props: ts.ObjectLiteralElementLike[];
      on: ts.ObjectLiteralElementLike[];
      directives: ts.Expression[];
    }

    const data: AttributeData = {
      props: [],
      on: [],
      directives: []
    };

    attrs.forEach(attr => {
      // Normal attributes
      // e.g. title="title"
      if (isVAttribute(attr)) {
        const name = attr.key.name;

        // Skip style and class because there may be v-bind for the same attribute which
        // occurs duplicate property name error.
        // Since native attribute value is not JS expression, we don't have to check it.
        if (name !== "class" && name !== "style") {
          data.props.push(transformNativeAttribute(attr));
        }
        return;
      }

      // v-bind directives
      // e.g. :class="{ selected: foo }"
      if (isVBind(attr)) {
        data.props.push(transformVBind(attr, code, scope));
        return;
      }

      // v-on directives
      // e.g. @click="onClick"
      if (isVOn(attr)) {
        data.on.push(transformVOn(attr, code, scope));
        return;
      }

      // Skip v-slot, v-for and v-if family directive (handled in `transformChildren`)
      if (
        isVSlot(attr) ||
        isVFor(attr) ||
        isVIf(attr) ||
        isVElseIf(attr) ||
        isVElse(attr)
      ) {
        return;
      }

      // Other directives
      const exp = transformDirective(attr, code, scope);
      if (exp) {
        data.directives.push(...exp);
      }
    });

    // Fold all AST into VNodeData-like object
    // example output:
    // {
    //   props: { class: 'title' },
    //   on: { click: __vlsListenerHelper(this, function($event) { this.onClick($event) } }
    // }
    return ts.createObjectLiteral([
      ts.createPropertyAssignment("props", ts.createObjectLiteral(data.props)),
      ts.createPropertyAssignment("on", ts.createObjectLiteral(data.on)),
      ts.createPropertyAssignment(
        "directives",
        ts.createArrayLiteral(data.directives)
      )
    ]);
  }

  function transformNativeAttribute(
    attr: AST.VAttribute
  ): ts.ObjectLiteralElementLike {
    return ts.createPropertyAssignment(
      ts.createStringLiteral(attr.key.name),
      attr.value ? ts.createLiteral(attr.value.value) : ts.createLiteral(true)
    );
  }

  function transformVBind(
    vBind: AST.VDirective,
    code: string,
    scope: string[]
  ): ts.ObjectLiteralElementLike {
    let exp: ts.Expression;
    if (!vBind.value || !vBind.value.expression) {
      exp = ts.createLiteral(true);
    } else {
      const value = vBind.value.expression as
        | AST.ESLintExpression
        | AST.VFilterSequenceExpression;
      if (value.type === "VFilterSequenceExpression") {
        exp = transformFilter(value, code, scope);
      } else {
        exp = parseExpression(value, code, scope);
      }
    }

    return directiveToObjectElement(vBind, exp, code, scope);
  }

  function transformVOn(
    vOn: AST.VDirective,
    code: string,
    scope: string[]
  ): ts.ObjectLiteralElementLike {
    let exp: ts.Expression;
    if (vOn.value && vOn.value.expression) {
      // value.expression can be ESLintExpression (e.g. ArrowFunctionExpression)
      const vOnExp = vOn.value.expression as
        | AST.VOnExpression
        | AST.ESLintExpression;

      if (!vOn.key.argument) {
        // e.g.
        //   v-on="$listeners"

        // Annotate the expression with `any` because we do not expect type error
        // with bridge type and it. Currently, bridge type should only be used
        // for inferring `$event` type.
        exp = ts.createAsExpression(
          vOnExp.type !== "VOnExpression"
            ? parseExpression(vOnExp, code, scope)
            : ts.createObjectLiteral([]),
          ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
        );
      } else {
        // e.g.
        //   @click="onClick"
        //   @click="onClick($event, 'test')"
        const newScope = scope.concat(vOnScope);
        const statements =
          vOnExp.type !== "VOnExpression"
            ? [
                ts.createExpressionStatement(
                  parseExpression(vOnExp, code, newScope)
                )
              ]
            : vOnExp.body.map(st => transformStatement(st, code, newScope));

        exp = ts.createFunctionExpression(
          undefined,
          undefined,
          undefined,
          undefined,
          [ts.createParameter(undefined, undefined, undefined, "$event")],
          undefined,
          ts.createBlock(statements)
        );
      }
    } else {
      // There are no statement in v-on value
      exp = ts.createFunctionExpression(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        ts.createBlock([])
      );
    }

    return directiveToObjectElement(vOn, exp, code, scope);
  }

  /**
   * To transform v-bind and v-on directive
   */
  function directiveToObjectElement(
    dir: AST.VDirective,
    dirExp: ts.Expression,
    code: string,
    scope: string[]
  ): ts.ObjectLiteralElementLike {
    const name = dir.key.argument;

    if (name) {
      if (name.type === "VIdentifier") {
        // Attribute name is specified
        // e.g. v-bind:value="foo"
        return ts.createPropertyAssignment(
          ts.createStringLiteral(name.name),
          dirExp
        );
      } else {
        // Attribute name is dynamic
        // e.g. v-bind:[value]="foo"

        // Empty expression is invalid. Return empty object spread.
        if (name.expression === null) {
          return ts.createSpreadAssignment(ts.createObjectLiteral());
        }

        const propertyName = ts.createComputedPropertyName(
          parseExpression(name.expression as AST.ESLintExpression, code, scope)
        );
        return ts.createPropertyAssignment(propertyName, dirExp);
      }
    } else {
      // Attribute name is omitted
      // e.g. v-bind="{ value: foo }"
      return ts.createSpreadAssignment(dirExp);
    }
  }

  /**
   * Return directive expression. May include dynamic argument expression.
   */
  function transformDirective(
    dir: AST.VDirective,
    code: string,
    scope: string[]
  ): ts.Expression[] {
    const res: ts.Expression[] = [];

    if (
      dir.key.argument &&
      dir.key.argument.type === "VExpressionContainer" &&
      dir.key.argument.expression
    ) {
      res.push(
        parseExpression(
          dir.key.argument.expression as AST.ESLintExpression,
          code,
          scope
        )
      );
    }

    if (dir.value && dir.value.expression) {
      res.push(
        parseExpression(
          dir.value.expression as AST.ESLintExpression,
          code,
          scope
        )
      );
    }

    return res;
  }

  function transformChildren(
    children: ESLintVChild[],
    code: string,
    originalScope: string[]
  ): ts.Expression[] {
    type ChildData = VIfFamilyData | VForData | VSlotData | NodeData;

    /**
     * For v-if, v-else-if and v-else
     */
    interface VIfFamilyData {
      type: "v-if-family";
      data: ChildData;
      directive: AST.VDirective;
      next?: VIfFamilyData;
    }

    interface VForData {
      type: "v-for";
      data: ChildData;
      vFor: AST.VDirective;
      scope: string[];
    }

    interface VSlotData {
      type: "v-slot";
      data: ChildData;
      vSlot: AST.VDirective;
      scope: string[];
    }

    interface NodeData {
      type: "node";
      data: ESLintVChild;
    }

    // Pre-transform child nodes to make further transformation easier
    function preTransform(children: ESLintVChild[]): ChildData[] {
      const queue = children.slice();

      function element(
        el: AST.VElement,
        attrs: (AST.VAttribute | AST.VDirective)[]
      ): ChildData {
        const vSlot = attrs.find(isVSlot);
        if (vSlot) {
          const index = attrs.indexOf(vSlot);
          const scope = el.variables
            .filter(v => v.kind === "scope")
            .map(v => v.id.name);

          return {
            type: "v-slot",
            vSlot,
            data: element(el, [
              ...attrs.slice(0, index),
              ...attrs.slice(index + 1)
            ]),
            scope
          };
        }

        // v-for has higher priority than v-if
        // https://vuejs.org/v2/guide/list.html#v-for-with-v-if
        const vFor = attrs.find(isVFor);
        if (vFor) {
          const index = attrs.indexOf(vFor);
          const scope = el.variables
            .filter(v => v.kind === "v-for")
            .map(v => v.id.name);

          return {
            type: "v-for",
            vFor,
            data: element(el, [
              ...attrs.slice(0, index),
              ...attrs.slice(index + 1)
            ]),
            scope
          };
        }

        const vIf = attrs.find(isVIf);
        if (vIf) {
          const index = attrs.indexOf(vIf);
          return {
            type: "v-if-family",
            directive: vIf,
            data: element(el, [
              ...attrs.slice(0, index),
              ...attrs.slice(index + 1)
            ]),
            next: followVIf()
          };
        }

        return {
          type: "node",
          data: el
        };
      }

      function followVIf(): VIfFamilyData | undefined {
        const el = queue[0];
        if (!el || el.type !== "VElement") {
          return undefined;
        }

        const attrs = el.startTag.attributes;
        const directive = attrs.find(isVElseIf) || attrs.find(isVElse);

        if (!directive) {
          return undefined;
        }

        queue.shift();
        return {
          type: "v-if-family",
          directive,
          data: element(el, attrs),
          next: followVIf()
        };
      }

      function loop(acc: ChildData[]): ChildData[] {
        const target = queue.shift();
        if (!target) {
          return acc;
        }

        if (target.type !== "VElement") {
          return loop(
            acc.concat({
              type: "node",
              data: target
            })
          );
        }

        return loop(acc.concat(element(target, target.startTag.attributes)));
      }

      return loop([]);
    }

    function mainTransform(children: ChildData[]): ts.Expression[] {
      function genericTransform(
        child: ChildData,
        scope: string[]
      ): ts.Expression {
        switch (child.type) {
          case "v-for":
            return vForTransform(child, scope);
          case "v-if-family":
            return vIfFamilyTransform(child, scope);
          case "v-slot":
            return vSlotTransform(child, scope);
          case "node":
            return nodeTransform(child, scope);
        }
      }

      function vIfFamilyTransform(
        vIfFamily: VIfFamilyData,
        scope: string[]
      ): ts.Expression {
        const dir = vIfFamily.directive;
        const exp =
          dir.value && (dir.value.expression as AST.ESLintExpression | null);

        const condition = exp
          ? parseExpression(exp, code, scope)
          : ts.createLiteral(true);
        const next = vIfFamily.next
          ? vIfFamilyTransform(vIfFamily.next, scope)
          : ts.createLiteral(true);

        return ts.createConditional(
          // v-if or v-else-if condition
          condition,

          // element that the v-if family directive belongs to
          genericTransform(vIfFamily.data, scope),

          // next sibling element of v-if or v-else if any
          next
        );
      }

      function vForTransform(
        vForData: VForData,
        scope: string[]
      ): ts.Expression {
        const vFor = vForData.vFor;
        if (!vFor.value || !vFor.value.expression) {
          return genericTransform(vForData.data, scope);
        }

        // Convert v-for directive to the iteration helper
        const exp = vFor.value.expression as AST.VForExpression;
        const newScope = scope.concat(vForData.scope);

        return ts.createCall(
          ts.createIdentifier(iterationHelperName),
          undefined,
          [
            // Iteration target
            parseExpression(exp.right, code, scope),

            // Callback

            ts.createArrowFunction(
              undefined,
              undefined,
              parseParams(exp.left, code, scope),
              undefined,
              ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              genericTransform(vForData.data, newScope)
            )
          ]
        );
      }

      function vSlotTransform(
        vSlotData: VSlotData,
        scope: string[]
      ): ts.Expression {
        const vSlot = vSlotData.vSlot;
        if (!vSlot.value || !vSlot.value.expression) {
          return genericTransform(vSlotData.data, scope);
        }

        const exp = vSlot.value.expression as AST.VSlotScopeExpression;
        const newScope = scope.concat(vSlotData.scope);

        return ts.createArrowFunction(
          undefined,
          undefined,
          parseParams(exp.params, code, scope),
          undefined,
          ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          genericTransform(vSlotData.data, newScope)
        );
      }

      function nodeTransform(
        nodeData: NodeData,
        scope: string[]
      ): ts.Expression {
        const child = nodeData.data;
        switch (child.type) {
          case "VElement":
            return transformElement(child, code, scope);
          case "VExpressionContainer": {
            const exp = child.expression as
              | AST.ESLintExpression
              | AST.VFilterSequenceExpression
              | null;
            if (!exp) {
              return ts.createLiteral("");
            }

            if (exp.type === "VFilterSequenceExpression") {
              return transformFilter(exp, code, scope);
            }

            return parseExpression(exp, code, scope);
          }
          case "VText":
            return ts.createLiteral(child.value);
        }
      }

      return children.map(child => genericTransform(child, originalScope));
    }

    // Remove whitespace nodes
    const filtered = children.filter(child => {
      return child.type !== "VText" || child.value.trim() !== "";
    });

    return mainTransform(preTransform(filtered));
  }

  function transformStatement(
    statement: AST.ESLintStatement,
    code: string,
    scope: string[]
  ): ts.Statement {
    if (statement.type !== "ExpressionStatement") {
      console.error("Unexpected statement type:", statement.type);
      return ts.createExpressionStatement(ts.createLiteral(""));
    }

    return ts.createExpressionStatement(
      parseExpression(statement.expression, code, scope)
    );
  }

  function transformFilter(
    filter: AST.VFilterSequenceExpression,
    code: string,
    scope: string[]
  ): ts.Expression {
    const exp = parseExpression(filter.expression, code, scope);

    // Simply convert all filter arguments into array literal because
    // we just want to check their types.
    // Do not care about existence of filters and matching between parameter
    // and argument types because filters will not appear on component type.
    const filterExps = ts.createArrayLiteral(
      filter.filters.map(f => {
        return ts.createArrayLiteral(
          f.arguments.map(arg => {
            const exp = arg.type === "SpreadElement" ? arg.argument : arg;
            return parseExpression(exp, code, scope);
          })
        );
      })
    );

    return ts.createBinary(filterExps, ts.SyntaxKind.BarBarToken, exp);
  }

  function parseExpression(
    expression: AST.ESLintExpression,
    code: string,
    scope: string[]
  ): ts.Expression {
    const [start, end] = expression.range;
    const expStr = code.slice(start, end);

    return parseExpressionImpl(expStr, scope, start);
  }

  function parseExpressionImpl(
    exp: string,
    scope: string[],
    start: number
  ): ts.Expression {
    // Add parenthesis to deal with object literal expression
    const wrappedExp = "(" + exp + ")";
    const source = ts.createSourceFile(
      "/tmp/parsed.ts",
      wrappedExp,
      ts.ScriptTarget.Latest,
      true
    );
    const statement = source.statements[0];

    if (!statement || !ts.isExpressionStatement(statement)) {
      console.error("Unexpected statement kind:", statement.kind);
      return ts.createLiteral("");
    }

    const parenthesis = statement.expression as ts.ParenthesizedExpression;

    // Compensate for the added `(` that adds 1 to each Node's offset
    const offset = start - "(".length;
    return walkExpression(
      ts,
      parenthesis.expression,
      createWalkCallback(scope, offset, source)
    );
  }

  function createWalkCallback(
    scope: string[],
    offset: number,
    source: ts.SourceFile
  ) {
    return (node: ts.Expression, additionalScope: ts.Identifier[]) => {
      const thisScope = scope.concat(additionalScope.map(id => id.text));

      const injected = injectThis(node, thisScope, offset, source);
      setSourceMapRange(injected, node, offset, source);
      resetTextRange(injected);
      return injected;
    };
  }

  function parseParams(
    params: AST.ESLintPattern[],
    code: string,
    scope: string[]
  ): ts.NodeArray<ts.ParameterDeclaration> {
    const start = params[0].range[0];
    const end = params[params.length - 1].range[1];
    const paramsStr = code.slice(start, end);
    // Wrap parameters with an arrow function to extract them as ts parameter declarations.
    const arrowFnStr = "(" + paramsStr + ") => {}";

    // Decrement the offset since the expression now has the open parenthesis.
    const exp = parseExpressionImpl(
      arrowFnStr,
      scope,
      start - 1
    ) as ts.ArrowFunction;
    return exp.parameters;
  }

  function injectThis(
    exp: ts.Expression,
    scope: string[],
    start: number,
    source: ts.SourceFile
  ): ts.Expression {
    if (ts.isIdentifier(exp)) {
      return scope.indexOf(exp.text) < 0
        ? ts.createPropertyAccess(ts.createThis(), exp)
        : exp;
    }

    if (ts.isObjectLiteralExpression(exp)) {
      const properties = exp.properties.map(p => {
        if (!ts.isShorthandPropertyAssignment(p)) {
          return p;
        }

        // Divide short hand property to name and initializer and inject `this`
        // We need to walk generated initializer expression.
        const initializer = createWalkCallback(scope, start, source)(
          p.name,
          []
        );
        return ts.createPropertyAssignment(p.name, initializer);
      });
      return ts.createObjectLiteral(properties);
    }

    return exp;
  }

  function setSourceMapRange(
    exp: ts.Expression,
    range: ts.Expression,
    offset: number,
    source: ts.SourceFile
  ): void {
    ts.setSourceMapRange(exp, {
      pos: offset + range.getStart(source),
      end: offset + range.getEnd()
    });

    if (ts.isPropertyAccessExpression(exp)) {
      // May be transformed from Identifier by injecting `this`
      const r = ts.isPropertyAccessExpression(range) ? range.name : range;
      ts.setSourceMapRange(exp.name, {
        pos: offset + r.getStart(source),
        end: offset + r.getEnd()
      });
      return;
    }

    if (ts.isArrowFunction(exp)) {
      const walkBinding = (name: ts.BindingName, range: ts.BindingName) => {
        ts.setSourceMapRange(name, {
          pos: offset + range.getStart(source),
          end: offset + range.getEnd()
        });

        if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
          name.elements.forEach((el, i) => {
            if (ts.isOmittedExpression(el)) {
              return;
            }
            const elRange = (range as typeof name).elements[i] as typeof el;

            ts.setSourceMapRange(el, {
              pos: offset + elRange.getStart(source),
              end: offset + elRange.getEnd()
            });

            walkBinding(el.name, elRange.name);
          });
        }
      };

      const r = range as ts.ArrowFunction;
      exp.parameters.forEach((p, i) => {
        const range = r.parameters[i];
        ts.setSourceMapRange(p, {
          pos: offset + range.getStart(source),
          end: offset + range.getEnd()
        });

        walkBinding(p.name, range.name);
      });
    }
  }

  /**
   * Because Nodes can have non-virtual positions
   * Set them to synthetic positions so printers could print correctly
   */
  function resetTextRange(exp: ts.Expression): void {
    if (ts.isObjectLiteralExpression(exp)) {
      exp.properties.forEach((p, i) => {
        if (ts.isPropertyAssignment(p) && !ts.isComputedPropertyName(p.name)) {
          ts.setTextRange(p.name, {
            pos: -1,
            end: -1
          });
        }
      });
    }

    if (ts.isTemplateExpression(exp)) {
      ts.setTextRange(exp.head, { pos: -1, end: -1 });
      exp.templateSpans.forEach(span => {
        ts.setTextRange(span.literal, {
          pos: -1,
          end: -1
        });
      });
    }

    ts.setTextRange(exp, { pos: -1, end: -1 });
  }

  function isVAttribute(
    node: AST.VAttribute | AST.VDirective
  ): node is AST.VAttribute {
    return !node.directive;
  }

  function isVBind(
    node: AST.VAttribute | AST.VDirective
  ): node is AST.VDirective {
    return node.directive && node.key.name.name === "bind";
  }

  function isVOn(
    node: AST.VAttribute | AST.VDirective
  ): node is AST.VDirective {
    return node.directive && node.key.name.name === "on";
  }

  function isVIf(
    node: AST.VAttribute | AST.VDirective
  ): node is AST.VDirective {
    return node.directive && node.key.name.name === "if";
  }

  function isVElseIf(
    node: AST.VAttribute | AST.VDirective
  ): node is AST.VDirective {
    return node.directive && node.key.name.name === "else-if";
  }

  function isVElse(
    node: AST.VAttribute | AST.VDirective
  ): node is AST.VDirective {
    return node.directive && node.key.name.name === "else";
  }

  function isVFor(
    node: AST.VAttribute | AST.VDirective
  ): node is AST.VDirective {
    return node.directive && node.key.name.name === "for";
  }

  function isVSlot(
    node: AST.VAttribute | AST.VDirective
  ): node is AST.VDirective {
    return (
      node.directive &&
      (node.key.name.name === "slot" || node.key.name.name === "slot-scope")
    );
  }

  function hasValidPos(node: ts.Node) {
    return node.pos !== -1 && node.end !== -1;
  }
}
