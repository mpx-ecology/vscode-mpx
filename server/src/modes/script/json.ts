import {
  TextDocument,
  Diagnostic,
  DiagnosticSeverity
} from "vscode-languageserver-types";
import { CLIEngine, Linter } from "eslint";
const { rules, configs, processors } = require("eslint-plugin-json");

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

const linter = createLintEngine();

export function getJsonMode(
  serviceHost: IServiceHost,
  documentRegions: LanguageModelCache<VueDocumentRegions>
): LanguageMode {
  const jsonDocuments = getLanguageModelCache<TextDocument>(10, 60, document =>
    documentRegions.refreshAndGet(document).getSingleLanguageDocument("json")
  );

  return {
    getId() {
      return "json";
    },
    doValidation(document: TextDocument): Diagnostic[] {
      const jsonDoc = jsonDocuments.refreshAndGet(document);
      const rawText = jsonDoc.getText();
      const report = linter.executeOnText(rawText, document.uri);
      console.log(report.results[0].messages);
      // return report.results[0] ? report.results[0].messages.map(toDiagnostic) : [];
      // const tags: DiagnosticTag[] = [];
      // return [<Diagnostic>{
      //     range: convertRange(scriptDoc, diag as ts.TextSpan),
      //     severity: DiagnosticSeverity.Error,
      //     message: '1111',
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
    dispose() {}
  };
}

function createLintEngine() {
  const conf = {
    useEslintrc: false,
    ...configs.recommended,
    parser: "jsonc-parser",
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true
      }
    }
  };
  console.log(conf.parser);
  console.log("console.log(conf.parser)");
  const cli = new CLIEngine(conf);
  cli.addPlugin("eslint-plugin-json", {
    rules,
    configs,
    processors
  });
  return cli;
}
