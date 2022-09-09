import { CLIEngine, Linter } from "eslint";
import { resolve } from "path";
import { configs } from "eslint-plugin-mpx";

import {
  TextDocument,
  Diagnostic,
  Range,
  DiagnosticSeverity
} from "vscode-languageserver-types";

function toDiagnostic(error: Linter.LintMessage): Diagnostic {
  const line = error.line - 1;
  const column = error.column - 1;
  const endLine = error.endLine ? error.endLine - 1 : line;
  const endColumn = error.endColumn ? error.endColumn - 1 : column;

  return {
    range: Range.create(line, column, endLine, endColumn),
    message: `\n[${error.ruleId}]\n${error.message}`,
    source: "eslint-plugin-mpx",
    severity:
      error.severity === 1
        ? DiagnosticSeverity.Warning
        : DiagnosticSeverity.Error
  };
}

export function doESLintValidation(
  document: TextDocument,
  engine: CLIEngine
): Diagnostic[] {
  const rawText = document.getText();
  // skip checking on empty template
  if (rawText.replace(/\s/g, "") === "") {
    return [];
  }
  const text = rawText.replace(/ {10}/, "<template>") + "</template>";
  const report = engine.executeOnText(text, document.uri);
  // return [];
  return report.results[0] ? report.results[0].messages.map(toDiagnostic) : [];
}

export function createLintEngine() {
  const SERVER_ROOT = resolve(__dirname, "../../../../");
  return new CLIEngine({
    useEslintrc: false,
    cwd: SERVER_ROOT,
    ...configs["composition-api-essential"],
    ...configs["mpx-essential"]
  });
}
