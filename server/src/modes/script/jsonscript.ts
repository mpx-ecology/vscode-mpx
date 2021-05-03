import { getJavascriptMode } from "./javascript";
import { LanguageModelCache } from "../../embeddedSupport/languageModelCache";
import { VueDocumentRegions } from "../../embeddedSupport/embeddedSupport";
import { IServiceHost } from "../../services/typescriptService/serviceHost";
import { VueInfoService } from "../../services/vueInfoService";
import { DependencyService } from "../../services/dependencyService";

export async function getJsonscriptMode(
  serviceHost: IServiceHost,
  documentRegions: LanguageModelCache<VueDocumentRegions>,
  workspacePath: string | undefined,
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
  return jsMode;
}
