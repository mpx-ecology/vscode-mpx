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
import * as fs from "fs";
const lintEngine = createLintEngine();

export function getJsonMode(
  serviceHost: IServiceHost,
  documentRegions: LanguageModelCache<VueDocumentRegions>,
  workspacePath: string | undefined
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
      // 获取json的文案
      const jsondoc = jsonRegionDocuments.refreshAndGet(doc);
      let text = jsondoc.getText();
      // 获取当前位置，用于找出当前所点选的单词
      const offset = scriptDoc.offsetAt(position);
      let left = offset;
      let right = offset;
      // 找位置
      if (offset) {
        while (left > 0 && text[left] !== '"' && text[left] !== "'") {
          left--;
        }
        while (
          right < text.length &&
          text[right] !== '"' &&
          text[right] !== "'"
        ) {
          right++;
        }
      }
      // 找出单词
      const startPosition = doc.positionAt(left + 1);
      const endPosition = doc.positionAt(right);
      const range = Range.create(startPosition, endPosition);
      const pointText = doc.getText(range).split("?")[0];

      // 是相对路径直接处理
      if (pointText.startsWith(".")) {
        const currentPath = path.dirname(doc.uri);
        let dPath = path.join(currentPath, pointText);
        dPath = checkFilePath(dPath);
        if (dPath) {
          return [
            {
              uri: Uri.file(dPath).toString(),
              range: Range.create(doc.positionAt(0), doc.positionAt(0))
            }
          ];
        }
      }
      // 不是相对路径只检查pages和usingComponents
      // format text 去掉空格
      text = text.replace(/\s*/g, "");
      // 找出usingComponents
      const usemap = JSON.parse(text);
      const usingComponents = usemap.usingComponents;
      const pages = usemap.pages || [];

      // p就是所点击的路径
      // 第一种情况是点击的是usingComponents对象的key
      let p = "";
      if (usingComponents[pointText]) {
        p = usingComponents[pointText];
      }
      // 第二种点击的是usingComponents对象的value
      // 或者是pages下的
      const usingComponentsValues = Object.values(usemap.usingComponents);
      if (
        usingComponentsValues.includes(pointText) ||
        pages.includes(pointText)
      ) {
        p = pointText;
      }

      // path分两种，一种是node_modules下的，一种是相对于当前目录的
      let dPath = "";
      if (p.startsWith(".")) {
        const currentPath = path.dirname(doc.uri);
        dPath = path.join(currentPath, p);
      } else {
        dPath = path.join(workspacePath + "/node_modules", p);
      }

      dPath = checkFilePath(dPath);

      if (!dPath) {
        return [];
      }

      return [
        {
          uri: Uri.file(dPath).toString(),
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

export function checkFilePath(filePath: string) {
  const filePaths = [filePath, filePath + ".mpx"];
  let dp = "";
  for (let i = 0; i < filePaths.length; i++) {
    dp = getFileFsPath(filePaths[i]);
    if (fs.existsSync(dp)) {
      return dp;
    }
  }
  return "";
}
