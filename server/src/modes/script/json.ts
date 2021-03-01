import {
  TextDocument,
  Diagnostic,
  Range,
  FormattingOptions,
  TextEdit,
  DiagnosticSeverity
} from "vscode-languageserver-types";
import { CLIEngine, Linter } from "eslint";
import { resolve } from "path";
// const { rules, configs, processors } = require("eslint-plugin-json");

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

// const linter = createLintEngine();
const lintEngine = createLintEngine();

export function getJsonMode(
  serviceHost: IServiceHost,
  documentRegions: LanguageModelCache<VueDocumentRegions>
): LanguageMode {
  const jsonDocuments = getLanguageModelCache<TextDocument>(10, 60, document =>
    documentRegions.refreshAndGet(document).getSingleLanguageDocument("json")
  );

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
      // const jsonDoc = jsonDocuments.refreshAndGet(document);
      // const rawText = jsonDoc.getText();
      // const report = linter.executeOnText(rawText, document.uri);
      const { jsonDoc, service } = updateCurrentVueTextDocument(document);
      const diagnostics = [];
      // if (!languageServiceIncludesFile(service, document.uri)) {
      //   return [];
      // }
      if (config.mpx.validation.json) {
        // const embedded = this.embeddedDocuments.refreshAndGet(document);
        diagnostics.push(...doESLintValidation(jsonDoc, lintEngine));
      }

      return diagnostics;
      // return report.results[0] ? report.results[0].messages.map(toDiagnostic) : [];
      // const tags: DiagnosticTag[] = [];
      // return [<Diagnostic>{
      //     range: convertRange(scriptDoc, diag as ts.TextSpan),
      //     severity: DiagnosticSeverity.Error,
      //     message: '1234',
      //     tags,
      //     code: diag.code,
      //     source: 'Mpx'
      //   }];
      return [];
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

    // findDefinition?(document: TextDocument, position: Position): Definition;

    onDocumentRemoved(document: TextDocument) {},
    dispose() {},
    format(
      doc: TextDocument,
      range: Range,
      formatParams: FormattingOptions
    ): TextEdit[] {
      const { scriptDoc, service } = updateCurrentVueTextDocument(doc);

      const defaultFormatter =
        scriptDoc.languageId === "json"
          ? config.mpx.format.defaultFormatter.json
          : config.mpx.format.defaultFormatter.ts;

      if (defaultFormatter === "none") {
        return [];
      }

      const parser = scriptDoc.languageId === "json" ? "json" : "typescript";
      const needInitialIndent = config.mpx.format.scriptInitialIndent;
      const vlsFormatConfig: VLSFormatConfig = config.mpx.format;

      if (
        defaultFormatter === "prettier" ||
        defaultFormatter === "prettier-eslint" ||
        defaultFormatter === "prettier-tslint"
      ) {
        const code = doc.getText(range);
        const filePath = getFileFsPath(scriptDoc.uri);
        let doFormat;
        if (defaultFormatter === "prettier-eslint") {
          doFormat = prettierEslintify;
        } else if (defaultFormatter === "prettier-tslint") {
          doFormat = prettierTslintify;
        } else {
          doFormat = prettierify;
        }
        return doFormat(
          code,
          filePath,
          range,
          vlsFormatConfig,
          parser,
          needInitialIndent
        );
      } else {
        const initialIndentLevel = needInitialIndent ? 1 : 0;
        const formatSettings: ts.FormatCodeSettings =
          scriptDoc.languageId === "javascript"
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
        const start = scriptDoc.offsetAt(range.start);
        const end = scriptDoc.offsetAt(range.end);
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
              range: convertRange(scriptDoc, edit.span),
              newText: edit.newText
            });
          }
        }
        return result;
      }
    }
  };
}

// function createLintEngine() {
//   const SERVER_ROOT = resolve(__dirname, "../../../");
//   const conf = {
//     useEslintrc: false,
//     cwd: SERVER_ROOT,
//     ...configs.recommended,
//     parser: "jsonc-parser"
//   };
//   const cli = new CLIEngine(conf);

//   return cli;
// }

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
