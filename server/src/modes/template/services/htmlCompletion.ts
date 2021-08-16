import {
  TextDocument,
  Position,
  CompletionList,
  CompletionItemKind,
  Range,
  TextEdit,
  InsertTextFormat,
  CompletionItem
} from "vscode-languageserver-types";
import { HTMLDocument } from "../parser/htmlParser";
import { TokenType, createScanner, ScannerState } from "../parser/htmlScanner";
import { IHTMLTagProvider } from "../tagProviders";
import * as emmet from "vscode-emmet-helper";
import { VueFileInfo } from "../../../services/vueInfoService";
import { doVueInterpolationComplete } from "./vueInterpolationCompletion";
import { NULL_COMPLETION } from "../../nullMode";
import { isInsideInterpolation } from "./isInsideInterpolation";
import { getModifierProvider, Modifier } from "../modifierProvider";

export function doComplete(
  document: TextDocument,
  position: Position,
  htmlDocument: HTMLDocument,
  tagProviders: IHTMLTagProvider[],
  emmetConfig: emmet.EmmetConfiguration,
  vueFileInfo?: VueFileInfo
): CompletionList {
  const modifierProvider = getModifierProvider();

  const result: CompletionList = {
    isIncomplete: false,
    items: []
  };

  const offset = document.offsetAt(position);
  const node = htmlDocument.findNodeBefore(offset);
  if (!node) {
    return result;
  }

  const nodeRange = Range.create(
    document.positionAt(node.start),
    document.positionAt(node.end)
  );
  const nodeText = document.getText(nodeRange);
  const insideInterpolation = isInsideInterpolation(
    node,
    nodeText,
    document.offsetAt(position) - node.start
  );

  if (node.isInterpolation) {
    if (!insideInterpolation) {
      return NULL_COMPLETION;
    }

    if (document.getText()[document.offsetAt(position) - 1] === ".") {
      return NULL_COMPLETION;
    }

    if (vueFileInfo) {
      return doVueInterpolationComplete(vueFileInfo);
    } else {
      return NULL_COMPLETION;
    }
  }

  const text = document.getText();
  const scanner = createScanner(text, node.start);
  let currentTag: string;
  let currentAttributeName = "";

  function getReplaceRange(
    replaceStart: number,
    replaceEnd: number = offset
  ): Range {
    if (replaceStart > offset) {
      replaceStart = offset;
    }
    return {
      start: document.positionAt(replaceStart),
      end: document.positionAt(replaceEnd)
    };
  }

  function collectOpenTagSuggestions(
    afterOpenBracket: number,
    tagNameEnd?: number
  ): CompletionList {
    const range = getReplaceRange(afterOpenBracket, tagNameEnd);
    tagProviders.forEach(provider => {
      const priority = provider.priority;
      provider.collectTags((tag, label) => {
        result.items.push({
          label: tag,
          kind: CompletionItemKind.Property,
          documentation: label,
          textEdit: TextEdit.replace(range, tag),
          sortText: priority + tag,
          insertTextFormat: InsertTextFormat.PlainText
        });
      });
    });
    return result;
  }

  function getLineIndent(offset: number) {
    let start = offset;
    while (start > 0) {
      const ch = text.charAt(start - 1);
      if ("\n\r".indexOf(ch) >= 0) {
        return text.substring(start, offset);
      }
      if (!isWhiteSpace(ch)) {
        return null;
      }
      start--;
    }
    return text.substring(0, offset);
  }

  function collectCloseTagSuggestions(
    afterOpenBracket: number,
    matchingOnly: boolean,
    tagNameEnd: number = offset
  ): CompletionList {
    const range = getReplaceRange(afterOpenBracket, tagNameEnd);
    const closeTag = isFollowedBy(
      text,
      tagNameEnd,
      ScannerState.WithinEndTag,
      TokenType.EndTagClose
    )
      ? ""
      : ">";
    let curr = node;
    while (curr) {
      const tag = curr.tag;
      if (
        tag &&
        (!curr.closed || (curr.endTagStart && curr.endTagStart > offset))
      ) {
        const item: CompletionItem = {
          label: "/" + tag,
          kind: CompletionItemKind.Property,
          filterText: "/" + tag + closeTag,
          textEdit: TextEdit.replace(range, "/" + tag + closeTag),
          insertTextFormat: InsertTextFormat.PlainText
        };
        const startIndent = getLineIndent(curr.start);
        const endIndent = getLineIndent(afterOpenBracket - 1);
        if (
          startIndent !== null &&
          endIndent !== null &&
          startIndent !== endIndent
        ) {
          const insertText = startIndent + "</" + tag + closeTag;
          (item.textEdit = TextEdit.replace(
            getReplaceRange(afterOpenBracket - 1 - endIndent.length),
            insertText
          )),
            (item.filterText = endIndent + "</" + tag + closeTag);
        }
        result.items.push(item);
        return result;
      }
      curr = curr.parent;
    }
    if (matchingOnly) {
      return result;
    }

    tagProviders.forEach(provider => {
      provider.collectTags((tag, label) => {
        result.items.push({
          label: "/" + tag,
          kind: CompletionItemKind.Property,
          documentation: label,
          filterText: "/" + tag + closeTag,
          textEdit: TextEdit.replace(range, "/" + tag + closeTag),
          insertTextFormat: InsertTextFormat.PlainText
        });
      });
    });
    return result;
  }

  function collectTagSuggestions(
    tagStart: number,
    tagEnd: number
  ): CompletionList {
    collectOpenTagSuggestions(tagStart, tagEnd);
    collectCloseTagSuggestions(tagStart, true, tagEnd);
    return result;
  }

  function collectAttributeNameSuggestions(
    nameStart: number,
    nameEnd: number = offset
  ): CompletionList {
    const execArray = /^[:@]/.exec(scanner.getTokenText());
    const filterPrefix = execArray ? execArray[0] : "";
    const start = filterPrefix ? nameStart + 1 : nameStart;
    const range = getReplaceRange(start, nameEnd);
    const value = isFollowedBy(
      text,
      nameEnd,
      ScannerState.AfterAttributeName,
      TokenType.DelimiterAssign
    )
      ? ""
      : '="$1"';
    const tag = currentTag.toLowerCase();
    tagProviders.forEach(provider => {
      const priority = provider.priority;
      provider.collectAttributes(tag, (attribute, type, documentation) => {
        if (
          (type === "event" && filterPrefix !== "@") ||
          (type !== "event" && filterPrefix === "@")
        ) {
          return;
        }
        let codeSnippet = attribute;
        if (type === "s" && value.length) {
          codeSnippet = codeSnippet + '="{{$1}}"';
        } else if (type !== "v" && value.length) {
          codeSnippet = codeSnippet + value;
        }
        result.items.push({
          label: attribute,
          kind:
            type === "event"
              ? CompletionItemKind.Function
              : CompletionItemKind.Value,
          textEdit: TextEdit.replace(range, codeSnippet),
          insertTextFormat: InsertTextFormat.Snippet,
          sortText: priority + attribute,
          documentation
        });
      });
    });
    const attributeName = scanner.getTokenText();
    if (/\.$/.test(attributeName)) {
      function addModifier(modifiers: { items: Modifier[]; priority: number }) {
        modifiers.items.forEach(modifier => {
          result.items.push({
            label: modifier.label,
            kind: CompletionItemKind.Method,
            textEdit: TextEdit.insert(
              document.positionAt(nameEnd),
              modifier.label
            ),
            insertTextFormat: InsertTextFormat.Snippet,
            sortText: modifiers.priority + modifier.label,
            documentation: modifier.documentation
          });
        });
      }

      if (attributeName.startsWith("@") || attributeName.startsWith("v-on")) {
        addModifier(modifierProvider.eventModifiers);
      }

      const execArray = /^(?:@|v-on:)([A-Za-z]*)\.?/.exec(attributeName);
      const eventName = execArray && execArray[1] ? execArray[1] : "";

      const keyEvent = ["keydown", "keypress", "keyup"];
      if (keyEvent.includes(eventName)) {
        addModifier(modifierProvider.keyModifiers);
        addModifier(modifierProvider.systemModifiers);
      }

      const mouseEvent = ["click", "dblclick", "mouseup", "mousedown"];
      if (mouseEvent.includes(eventName)) {
        addModifier(modifierProvider.mouseModifiers);
        addModifier(modifierProvider.systemModifiers);
      }

      if (attributeName.startsWith("v-bind") || attributeName.startsWith(":")) {
        addModifier(modifierProvider.propsModifiers);
      }

      if (attributeName.startsWith("v-model")) {
        addModifier(modifierProvider.vModelModifiers);
      }
    }
    return result;
  }

  function collectAttributeValueSuggestions(
    attr: string,
    valueStart: number,
    valueEnd?: number
  ): CompletionList {
    if (attr.startsWith("v-") || attr.startsWith("@") || attr.startsWith(":")) {
      if (vueFileInfo && insideInterpolation) {
        return doVueInterpolationComplete(vueFileInfo);
      } else {
        return NULL_COMPLETION;
      }
    }

    let range: Range;
    let addQuotes: boolean;
    if (
      valueEnd &&
      offset > valueStart &&
      offset <= valueEnd &&
      text[valueStart] === '"'
    ) {
      // inside attribute
      if (valueEnd > offset && text[valueEnd - 1] === '"') {
        valueEnd--;
      }
      const wsBefore = getWordStart(text, offset, valueStart + 1);
      const wsAfter = getWordEnd(text, offset, valueEnd);
      range = getReplaceRange(wsBefore, wsAfter);
      addQuotes = false;
    } else {
      range = getReplaceRange(valueStart, valueEnd);
      addQuotes = true;
    }
    const tag = currentTag.toLowerCase();
    const attribute = currentAttributeName.toLowerCase();
    tagProviders.forEach(provider => {
      provider.collectValues(tag, attribute, value => {
        const insertText = addQuotes ? '"' + value + '"' : value;
        result.items.push({
          label: value,
          filterText: insertText,
          kind: CompletionItemKind.Unit,
          textEdit: TextEdit.replace(range, insertText),
          insertTextFormat: InsertTextFormat.PlainText
        });
      });
    });
    return result;
  }

  function scanNextForEndPos(nextToken: TokenType): number {
    if (offset === scanner.getTokenEnd()) {
      token = scanner.scan();
      if (token === nextToken && scanner.getTokenOffset() === offset) {
        return scanner.getTokenEnd();
      }
    }
    return offset;
  }

  let token = scanner.scan();

  while (token !== TokenType.EOS && scanner.getTokenOffset() <= offset) {
    switch (token) {
      case TokenType.StartTagOpen:
        if (scanner.getTokenEnd() === offset) {
          const endPos = scanNextForEndPos(TokenType.StartTag);
          return collectTagSuggestions(offset, endPos);
        }
        break;
      case TokenType.StartTag:
        if (
          scanner.getTokenOffset() <= offset &&
          offset <= scanner.getTokenEnd()
        ) {
          return collectOpenTagSuggestions(
            scanner.getTokenOffset(),
            scanner.getTokenEnd()
          );
        }
        currentTag = scanner.getTokenText();
        break;
      case TokenType.AttributeName:
        if (
          scanner.getTokenOffset() <= offset &&
          offset <= scanner.getTokenEnd()
        ) {
          return collectAttributeNameSuggestions(
            scanner.getTokenOffset(),
            scanner.getTokenEnd()
          );
        }
        currentAttributeName = scanner.getTokenText();
        break;
      case TokenType.DelimiterAssign:
        if (scanner.getTokenEnd() === offset) {
          return collectAttributeValueSuggestions(
            currentAttributeName,
            scanner.getTokenEnd()
          );
        }
        break;
      case TokenType.AttributeValue:
        if (
          scanner.getTokenOffset() <= offset &&
          offset <= scanner.getTokenEnd()
        ) {
          return collectAttributeValueSuggestions(
            currentAttributeName,
            scanner.getTokenOffset(),
            scanner.getTokenEnd()
          );
        }
        break;
      case TokenType.Whitespace:
        if (offset <= scanner.getTokenEnd()) {
          switch (scanner.getScannerState()) {
            case ScannerState.AfterOpeningStartTag:
              const startPos = scanner.getTokenOffset();
              const endTagPos = scanNextForEndPos(TokenType.StartTag);
              return collectTagSuggestions(startPos, endTagPos);
            case ScannerState.WithinTag:
            case ScannerState.AfterAttributeName:
              return collectAttributeNameSuggestions(scanner.getTokenEnd());
            case ScannerState.BeforeAttributeValue:
              return collectAttributeValueSuggestions(
                currentAttributeName,
                scanner.getTokenEnd()
              );
            case ScannerState.AfterOpeningEndTag:
              return collectCloseTagSuggestions(
                scanner.getTokenOffset() - 1,
                false
              );
          }
        }
        break;
      case TokenType.EndTagOpen:
        if (offset <= scanner.getTokenEnd()) {
          const afterOpenBracket = scanner.getTokenOffset() + 1;
          const endOffset = scanNextForEndPos(TokenType.EndTag);
          return collectCloseTagSuggestions(afterOpenBracket, false, endOffset);
        }
        break;
      case TokenType.EndTag:
        if (offset <= scanner.getTokenEnd()) {
          let start = scanner.getTokenOffset() - 1;
          while (start >= 0) {
            const ch = text.charAt(start);
            if (ch === "/") {
              return collectCloseTagSuggestions(
                start,
                false,
                scanner.getTokenEnd()
              );
            } else if (!isWhiteSpace(ch)) {
              break;
            }
            start--;
          }
        }
        break;
      case TokenType.Content:
        if (offset <= scanner.getTokenEnd()) {
          return emmet.doComplete(document, position, "html", emmetConfig);
        }
        break;
      default:
        if (offset <= scanner.getTokenEnd()) {
          return result;
        }
        break;
    }
    token = scanner.scan();
  }
  return result;
}

function isWhiteSpace(s: string): boolean {
  return /^\s*$/.test(s);
}

function isFollowedBy(
  s: string,
  offset: number,
  intialState: ScannerState,
  expectedToken: TokenType
) {
  const scanner = createScanner(s, offset, intialState);
  let token = scanner.scan();
  while (token === TokenType.Whitespace) {
    token = scanner.scan();
  }
  return token === expectedToken;
}

function getWordStart(s: string, offset: number, limit: number): number {
  while (offset > limit && !isWhiteSpace(s[offset - 1])) {
    offset--;
  }
  return offset;
}

function getWordEnd(s: string, offset: number, limit: number): number {
  while (offset < limit && !isWhiteSpace(s[offset])) {
    offset++;
  }
  return offset;
}
