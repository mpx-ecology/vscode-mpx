import * as ts from "typescript";
import Uri from "vscode-uri";
import * as path from "path";
import { getJavascriptMode } from "./javascript";
import { LanguageModelCache } from "../../embeddedSupport/languageModelCache";
import { VueDocumentRegions } from "../../embeddedSupport/embeddedSupport";
import { IServiceHost } from "../../services/typescriptService/serviceHost";
import { VueInfoService } from "../../services/vueInfoService";
import { DependencyService } from "../../services/dependencyService";
import {
  Position,
  TextDocument,
  Definition,
  Range
} from "vscode-languageserver-types";
import { languageServiceIncludesFile } from "./javascript";
import { checkFilePath } from "./json";
import { getFileFsPath, getFilePath } from "../../utils/paths";

export async function getJsonscriptMode(
  serviceHost: IServiceHost,
  documentRegions: LanguageModelCache<VueDocumentRegions>,
  workspacePath: string | undefined,
  jsonScriptRegionDocuments: LanguageModelCache<TextDocument>,
  vueInfoService?: VueInfoService,
  dependencyService?: DependencyService
) {
  const jsMode = await getJavascriptMode(
    serviceHost,
    documentRegions,
    workspacePath,
    vueInfoService,
    dependencyService
  );
  jsMode.getId = () => "jsonscript";
  const { updateCurrentVueTextDocument } = serviceHost;
  const rawFindDefinition = jsMode.findDefinition as (
    document: TextDocument,
    position: Position
  ) => Definition;
  function findDefinition(doc: TextDocument, position: Position): Definition {
    const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
    if (!languageServiceIncludesFile(service, doc.uri)) {
      return [];
    }
    const fileFsPath = getFileFsPath(doc.uri);
    const range = service.getSmartSelectionRange(
      fileFsPath,
      scriptDoc.offsetAt(position)
    );

    const pointText = doc.getText(convertRange(scriptDoc, range.textSpan));
    const result: any = [];

    if (pointText.includes("/")) {
      let dPath = "";
      if (pointText.startsWith(".")) {
        const currentPath = path.dirname(doc.uri);
        dPath = path.join(currentPath, pointText);
      } else {
        dPath = path.join(workspacePath + "/node_modules", pointText);
      }
      dPath = checkFilePath(dPath);
      if (dPath) {
        result.push({
          uri: Uri.file(dPath).toString(),
          range: Range.create(doc.positionAt(0), doc.positionAt(0))
        });
      }
    }

    const rawResult = rawFindDefinition(doc, position);
    return result.concat(rawResult);
  }
  jsMode.findDefinition = findDefinition;
  jsMode.updateFileInfo = (doc: TextDocument) => {
    if (!vueInfoService) {
      return;
    }
    const jsondoc = jsonScriptRegionDocuments.refreshAndGet(doc);
    let text = jsondoc.getText();
    text = text.replace(/\s*/g, "");
    const res = text.match(/usingComponents:(\{.*\})/);
    if (res && res[1]) {
      const jsonText = res[1].replace(/'/g, '"');
      const pathList: RegExpMatchArray | [] =
        jsonText.match(/[^({|}|,)]*:"[^"]*"/g) || [];
      const usingComponents: any = {};
      pathList.forEach(item => {
        if (item.slice(0, 2) !== "//") {
          const splitPath = item.split(":");
          if (splitPath.length > 1) {
            const [k, v] = splitPath;
            const key = k.replace(/"/g, "");
            const value = v.replace(/"/g, "");
            usingComponents[key] = value;
          }
        }
      });
      vueInfoService.updateInfo(doc, {
        componentInfo: {
          childMap: usingComponents
        }
      });
    }
  };
  return jsMode;
}

function convertRange(document: TextDocument, span: ts.TextSpan): Range {
  const startPosition = document.positionAt(span.start);
  const endPosition = document.positionAt(span.start + span.length);
  return Range.create(startPosition, endPosition);
}
