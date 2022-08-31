import {
  TextDocument,
  Diagnostic,
  Range,
  FormattingOptions,
  TextEdit,
  DiagnosticSeverity,
  Position,
  Definition
} from "vscode-languageserver-types";
import Uri from "vscode-uri";
import { LanguageMode } from "../../embeddedSupport/languageModes";
import { IServiceHost } from "../../services/typescriptService/serviceHost";
import {
  LanguageModelCache,
  getLanguageModelCache
} from "../../embeddedSupport/languageModelCache";
import {
  VueDocumentRegions,
  LanguageRange
} from "../../embeddedSupport/embeddedSupport";
import { VLSFormatConfig } from "../../config";
import { getFileFsPath, getFilePath } from "../../utils/paths";
import * as ts from "typescript";
import * as _ from "lodash";
import {
  prettierify,
  prettierEslintify,
  prettierTslintify
} from "../../utils/prettier";
import { doESLintValidation, createLintEngine } from "./jsonValidation";
import { languageServiceIncludesFile } from "./javascript";
import * as path from "path";
const lintEngine = createLintEngine();

export function getJsonMode(
  serviceHost: IServiceHost,
  documentRegions: LanguageModelCache<VueDocumentRegions>
): LanguageMode {
  const jsonRegionDocuments = getLanguageModelCache(10, 60, document => {
    const vueDocument = documentRegions.refreshAndGet(document);
    return vueDocument.getSingleTypeDocument("json");
  });
  const { updateCurrentVueTextDocument } = serviceHost;
  let config: any = {};

  return {
    getId() {
      return "json";
    },
    configure(c: any) {
      config = c;
    },
    doValidation(document: TextDocument): Diagnostic[] {
      // const { jsonDoc, service } = updateCurrentVueTextDocument(document);
      const diagnostics = [];
      // if (!languageServiceIncludesFile(service, document.uri)) {
      //   return [];
      // }
      if (config.mpx.validation.json) {
        diagnostics.push(
          ...doESLintValidation(
            jsonRegionDocuments.refreshAndGet(document)!,
            lintEngine
          )
        );
      }
      return diagnostics;
    },
    // getCodeActions?(
    //     document: TextDocument,
    //     range: Range,
    //     formatParams: FormattingOptions,
    //     context: CodeActionContext
    // ): Command[];
    // doComplete?(document: TextDocument, position: Position): CompletionList;
    // doResolve?(document: TextDocument, item: CompletionItem): CompletionItem;
    // doHover?(document: TextDocument, position: Position): Hover;

    findDefinition(doc: TextDocument, position: Position): Definition {
      const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
      if (!languageServiceIncludesFile(service, doc.uri)) {
        return [];
      }
      const fileFsPath = getFileFsPath(doc.uri);
      const definitions = service.getDefinitionAtPosition(
        fileFsPath,
        scriptDoc.offsetAt(position)
      );
      const offset = scriptDoc.offsetAt(position);
      let left = offset;
      let right = offset;
      const jsondoc = jsonRegionDocuments.refreshAndGet(doc);
      let text = jsondoc.getText();
      console.log(offset);
      if (offset) {
        while (text[left] !== '\"' && text[left] !== "\'") {
          left--;
        }
        while (text[right] !== '\"' && text[right] !== "\'") {
          right++;
        }
      }

      console.log(left);
      console.log(right);
      console.log(text[left]);
      console.log(text[right]);
      const startPosition = doc.positionAt(left + 1);
      const endPosition = doc.positionAt(right);
      const range = Range.create(startPosition, endPosition);
      const imkey = doc.getText(range);
      console.log(imkey);
      text = text.replace(/\s*/g, '');
      // text = text.replace(/(\")*/g, '"')
      console.log(text);
      const usemap = JSON.parse(text);
      const usingComponents = usemap.usingComponents;
      console.log(usemap.usingComponents);
      let p = '';
      if (usingComponents[imkey]) {
        p = usingComponents[imkey];
      }
      const vals = Object.values(usemap.usingComponents);

      if (vals.includes(imkey)) {
        p = imkey;
      }
      const currentPath = path.dirname(doc.uri);
      const dPath = path.join(currentPath, p);
      console.log(dPath);
      const dp = getFileFsPath(dPath);
      console.log(dp);
      return [
        {
          uri: Uri.file(dp + '.mpx').toString(),
          range: Range.create(doc.positionAt(0), doc.positionAt(0))
        }
      ];
    },
    onDocumentRemoved(document: TextDocument) {},
    dispose() {},
    format(
      doc: TextDocument,
      range: Range,
      formatParams: FormattingOptions
    ): TextEdit[] {
      const { service } = updateCurrentVueTextDocument(doc);
      const jsonDoc = jsonRegionDocuments.refreshAndGet(doc)!;
      const defaultFormatter =
        jsonDoc.languageId === "json"
          ? config.mpx.format.defaultFormatter.json
          : config.mpx.format.defaultFormatter.ts;

      if (defaultFormatter === "none") {
        return [];
      }

      const parser = jsonDoc.languageId === "json" ? "json" : "typescript";
      const needInitialIndent = config.mpx.format.scriptInitialIndent;
      const vlsFormatConfig: VLSFormatConfig = config.mpx.format;

      if (
        defaultFormatter === "prettier" ||
        defaultFormatter === "prettier-eslint" ||
        defaultFormatter === "prettier-tslint"
      ) {
        const code = doc.getText(range);
        const filePath = getFileFsPath(jsonDoc.uri);
        let doFormat;
        if (defaultFormatter === "prettier-eslint") {
          doFormat = prettierEslintify;
        } else if (defaultFormatter === "prettier-tslint") {
          doFormat = prettierTslintify;
        } else {
          doFormat = prettierify;
        }
        const currentCode = doFormat(
          code,
          filePath,
          range,
          vlsFormatConfig,
          parser,
          needInitialIndent
        );
        // 为了加上空格
        if (vlsFormatConfig.mpxIndentScriptAndStyle) {
          const tabSize = " ".repeat(vlsFormatConfig.options.tabSize);
          currentCode.forEach((item: { newText: string }) => {
            item.newText = item.newText
              .split("\n")
              .map(line => {
                if (line.length) {
                  return tabSize + line;
                }
                return line;
              })
              .join("\n");
          });
        }
        return currentCode;
      } else {
        const initialIndentLevel = needInitialIndent ? 1 : 0;
        const formatSettings: ts.FormatCodeSettings =
          jsonDoc.languageId === "javascript"
            ? config.javascript.format
            : config.typescript.format;
        const convertedFormatSettings = convertOptions(
          formatSettings,
          {
            tabSize: vlsFormatConfig.options.tabSize,
            insertSpaces: !vlsFormatConfig.options.useTabs
          },
          initialIndentLevel
        );

        const fileFsPath = getFileFsPath(doc.uri);
        const start = jsonDoc.offsetAt(range.start);
        const end = jsonDoc.offsetAt(range.end);
        const edits = service.getFormattingEditsForRange(
          fileFsPath,
          start,
          end,
          convertedFormatSettings
        );

        if (!edits) {
          return [];
        }
        const result = [];
        for (const edit of edits) {
          if (
            edit.span.start >= start &&
            edit.span.start + edit.span.length <= end
          ) {
            result.push({
              range: convertRange(jsonDoc, edit.span),
              newText: edit.newText
            });
          }
        }
        return result;
      }
    }
  };
}

function convertRange(document: TextDocument, span: ts.TextSpan): Range {
  const startPosition = document.positionAt(span.start);
  const endPosition = document.positionAt(span.start + span.length);
  return Range.create(startPosition, endPosition);
}

function convertOptions(
  formatSettings: ts.FormatCodeSettings,
  options: FormattingOptions,
  initialIndentLevel: number
): ts.FormatCodeSettings {
  return _.assign(formatSettings, {
    convertTabsToSpaces: options.insertSpaces,
    tabSize: options.tabSize,
    indentSize: options.tabSize,
    baseIndentSize: options.tabSize * initialIndentLevel
  });
}

function getSourceDoc(fileName: string, program: ts.Program): TextDocument {
  const sourceFile = program.getSourceFile(fileName)!;
  return TextDocument.create(fileName, "mpx", 0, sourceFile.getFullText());
}
