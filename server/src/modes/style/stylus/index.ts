import * as _ from "lodash";
import * as emmet from "vscode-emmet-helper";
import { CompletionList, TextEdit } from "vscode-languageserver-types";
import { IStylusSupremacy } from "./stylus-supremacy";

import { Priority } from "../emmet";
import {
  LanguageModelCache,
  getLanguageModelCache
} from "../../../embeddedSupport/languageModelCache";
import { LanguageMode } from "../../../embeddedSupport/languageModes";
import { VueDocumentRegions } from "../../../embeddedSupport/embeddedSupport";

import { provideCompletionItems } from "./completion-item";
import { provideDocumentSymbols } from "./symbols-finder";
import { stylusHover } from "./stylus-hover";
import { requireLocalPkg } from "../../../utils/prettier/requirePkg";
import { getFileFsPath } from "../../../utils/paths";
import { VLSFormatConfig } from "../../../config";

export function getStylusMode(
  documentRegions: LanguageModelCache<VueDocumentRegions>
): LanguageMode {
  const embeddedDocuments = getLanguageModelCache(10, 60, document =>
    documentRegions.refreshAndGet(document).getSingleLanguageDocument("stylus")
  );
  let baseIndentShifted = false;
  let config: any = {};
  return {
    getId: () => "stylus",
    configure(c) {
      baseIndentShifted = _.get(c, "mpx.format.styleInitialIndent", false);
      config = c;
    },
    onDocumentRemoved() {},
    dispose() {},
    doComplete(document, position) {
      const embedded = embeddedDocuments.refreshAndGet(document);

      const lsCompletions = provideCompletionItems(embedded, position);
      const lsItems = _.map(lsCompletions.items, i => {
        return {
          ...i,
          sortText: Priority.Platform + i.label
        };
      });

      const emmetCompletions: CompletionList = emmet.doComplete(
        document,
        position,
        "stylus",
        config.emmet
      );
      if (!emmetCompletions) {
        return { isIncomplete: false, items: lsItems };
      } else {
        const emmetItems = _.map(emmetCompletions.items, i => {
          return {
            ...i,
            sortText: Priority.Emmet + i.label
          };
        });
        return {
          isIncomplete: emmetCompletions.isIncomplete,
          items: _.concat(emmetItems, lsItems)
        };
      }
    },
    findDocumentSymbols(document) {
      const embedded = embeddedDocuments.refreshAndGet(document);
      return provideDocumentSymbols(embedded);
    },
    doHover(document, position) {
      const embedded = embeddedDocuments.refreshAndGet(document);
      return stylusHover(embedded, position);
    },
    format(document, range, formatParams) {
      if (config.mpx.format.defaultFormatter.stylus === "none") {
        return [];
      }

      const stylusSupremacy: IStylusSupremacy = requireLocalPkg(
        getFileFsPath(document.uri),
        "stylus-supremacy"
      );

      const inputText = document.getText(range);

      const vlsFormatConfig = config.mpx.format as VLSFormatConfig;
      const tabStopChar = vlsFormatConfig.options.useTabs
        ? "\t"
        : " ".repeat(vlsFormatConfig.options.tabSize);

      // Note that this would have been `document.eol` ideally
      const newLineChar = inputText.includes("\r\n") ? "\r\n" : "\n";

      // Determine the base indentation for the multi-line Stylus content
      let baseIndent = "";
      if (range.start.line !== range.end.line) {
        const styleTagLine = document.getText().split(/\r?\n/)[
          range.start.line
        ];
        if (styleTagLine) {
          baseIndent = _.get(styleTagLine.match(/^(\t|\s)+/), "0", "");
        }
      }

      // Add one more indentation when `mpx.format.styleInitialIndent` is set to `true`
      if (baseIndentShifted) {
        baseIndent += tabStopChar;
      }

      const vscodePrettierOptions =
        config.mpx.format.defaultFormatterOptions["stylus-supremacy"] || {};

      // Build the formatting options for Stylus Supremacy
      // See https://thisismanta.github.io/stylus-supremacy/#options
      const stylusSupremacyFormattingOptions = stylusSupremacy.createFormattingOptions(
        vscodePrettierOptions
      );
      const formattingOptions = {
        ...stylusSupremacyFormattingOptions,
        tabStopChar,
        newLineChar: "\n"
      };

      const formattedText = stylusSupremacy.format(
        inputText,
        formattingOptions
      );

      // Add the base indentation and correct the new line characters
      const outputText = formattedText
        .split(/\n/)
        .map(line => (line.length > 0 ? baseIndent + line : ""))
        .join(newLineChar);

      return [TextEdit.replace(range, outputText)];
    }
  };
}

export const wordPattern = /(#?-?\d*\.\d\w*%?)|([$@#!.:]?[\w-?]+%?)|[$@#!.]/g;
