import { HTMLDocument } from "../parser/htmlParser";
import { TokenType, createScanner } from "../parser/htmlScanner";
import {
  TextDocument,
  Range,
  Position,
  Definition,
  Location
} from "vscode-languageserver-types";
import { VueFileInfo } from "../../../services/vueInfoService";
import URI from "vscode-uri";
import * as path from "path";
import { checkFilePath } from "../../script/json";
const TRIVIAL_TOKEN = [
  TokenType.StartTagOpen,
  TokenType.EndTagOpen,
  TokenType.Whitespace
];

export function findDefinition(
  document: TextDocument,
  position: Position,
  htmlDocument: HTMLDocument,
  workspacePath: string,
  vueFileInfo?: VueFileInfo
): Definition {
  const offset = document.offsetAt(position);
  const node = htmlDocument.findNodeAt(offset);
  if (!node || !node.tag) {
    return [];
  }

  function getTagDefinition(
    tag: string,
    range: Range,
    open: boolean
  ): Definition {
    if (
      vueFileInfo &&
      vueFileInfo.componentInfo.childMap &&
      vueFileInfo.componentInfo.childMap[tag]
    ) {
      const childPath = vueFileInfo.componentInfo.childMap[tag];
      let dPath = "";
      if (childPath.startsWith(".")) {
        const currentPath = path.dirname(document.uri);
        dPath = path.join(currentPath, childPath);
      } else {
        dPath = path.join(workspacePath + "/node_modules", childPath);
      }
      dPath = checkFilePath(dPath);
      if (!dPath) {
        return [];
      }
      return [
        {
          uri: URI.file(dPath).toString(),
          range: Range.create(document.positionAt(0), document.positionAt(0))
        }
      ];
    }

    return [];
  }

  const inEndTag = node.endTagStart && offset >= node.endTagStart; // <html></ht|ml>
  const startOffset = inEndTag ? node.endTagStart : node.start;
  const scanner = createScanner(document.getText(), startOffset);
  let token = scanner.scan();

  function shouldAdvance() {
    if (token === TokenType.EOS) {
      return false;
    }
    const tokenEnd = scanner.getTokenEnd();
    if (tokenEnd < offset) {
      return true;
    }

    if (tokenEnd === offset) {
      return TRIVIAL_TOKEN.includes(token);
    }
    return false;
  }

  while (shouldAdvance()) {
    token = scanner.scan();
  }

  if (offset > scanner.getTokenEnd()) {
    return [];
  }
  const tagRange = {
    start: document.positionAt(scanner.getTokenOffset()),
    end: document.positionAt(scanner.getTokenEnd())
  };
  switch (token) {
    case TokenType.StartTag:
      return getTagDefinition(node.tag, tagRange, true);
    case TokenType.EndTag:
      return getTagDefinition(node.tag, tagRange, false);
  }

  return [];
}
