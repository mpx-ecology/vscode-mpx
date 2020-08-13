import * as vscode from "vscode";
import { LanguageClient, WorkspaceEdit } from "vscode-languageclient";
import { generateGrammarCommandHandler } from "./commands/generateGrammarCommand";
import { registerLanguageConfigurations } from "./languages";
import { initializeLanguageClient } from "./client";
import { join } from "path";
import {
  setVirtualContents,
  registerVeturTextDocumentProviders,
  generateShowVirtualFileCommand
} from "./commands/virtualFileCommand";
import { getGlobalSnippetDir } from "./userSnippetDir";
import { generateOpenUserScaffoldSnippetFolderCommand } from "./commands/openUserScaffoldSnippetFolderCommand";

export async function activate(context: vscode.ExtensionContext) {
  const isInsiders = vscode.env.appName.includes("Insiders");
  const globalSnippetDir = getGlobalSnippetDir(isInsiders);

  /**
   * Virtual file display command for debugging template interpolation
   */
  context.subscriptions.push(await registerVeturTextDocumentProviders());

  /**
   * Custom Block Grammar generation command
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mpx.generateGrammar",
      generateGrammarCommandHandler(context.extensionPath)
    )
  );

  /**
   * Open custom snippet folder
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mpx.openUserScaffoldSnippetFolder",
      generateOpenUserScaffoldSnippetFolderCommand(globalSnippetDir)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mpx.applyWorkspaceEdits",
      (args: WorkspaceEdit) => {
        const edit = client.protocol2CodeConverter.asWorkspaceEdit(args)!;
        vscode.workspace.applyEdit(edit);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mpx.chooseTypeScriptRefactoring",
      (args: any) => {
        client
          .sendRequest<vscode.Command | undefined>(
            "requestCodeActionEdits",
            args
          )
          .then(
            command =>
              command &&
              vscode.commands.executeCommand(
                command.command,
                ...command.arguments!
              )
          );
      }
    )
  );

  registerLanguageConfigurations();

  /**
   * Vue Language Server Initialization
   */

  const serverModule = context.asAbsolutePath(
    join("server", "dist", "vueServerMain.js")
  );
  const client = initializeLanguageClient(serverModule, globalSnippetDir);
  context.subscriptions.push(client.start());

  client
    .onReady()
    .then(() => {
      registerCustomClientNotificationHandlers(client);
      registerCustomLSPCommands(context, client);
    })
    .catch(e => {
      console.log("Client initialization failed");
    });
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      ["mpx"],
      {
        provideCompletionItems,
        resolveCompletionItem
      },
      "1"
    )
  );
}

function registerCustomClientNotificationHandlers(client: LanguageClient) {
  client.onNotification("$/displayInfo", (msg: string) => {
    vscode.window.showInformationMessage(msg);
  });
  client.onNotification("$/displayWarning", (msg: string) => {
    vscode.window.showWarningMessage(msg);
  });
  client.onNotification("$/displayError", (msg: string) => {
    vscode.window.showErrorMessage(msg);
  });
  client.onNotification(
    "$/showVirtualFile",
    (virtualFileSource: string, prettySourceMap: string) => {
      setVirtualContents(virtualFileSource, prettySourceMap);
    }
  );
}

function registerCustomLSPCommands(
  context: vscode.ExtensionContext,
  client: LanguageClient
) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mpx.showCorrespondingVirtualFile",
      generateShowVirtualFileCommand(client)
    )
  );
}

// 微信的原始组件
const keys = [
  "cover-image",
  "cover-view",
  "match-media",
  "movable-area",
  "movable-view",
  "scroll-view",
  "swiper",
  "swiper-item",
  "view",
  "icon",
  "progress",
  "rich-text",
  "text",
  // 'button',
  "checkbox",
  "checkbox-group",
  "editor",
  // 'form',
  // 'input',
  // 'label',
  "picker",
  "picker-view",
  "picker-view-column",
  "radio",
  "radio-group",
  "slider",
  "switch",
  "textarea",
  "functional-page-navigator",
  "navigator",
  // 'audio',
  "camera",
  // 'image',
  "live-player",
  "live-pusher",
  // 'video',
  "voip-room",
  // 'map',
  // 'canvas',
  "ad",
  "ad-custom",
  "official-account",
  "open-data",
  "web-view"
];

// 确定提示的位置
function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
  const text = document.getText();
  const tempEnd = text.lastIndexOf("</template>");
  const temp = text.slice(0, tempEnd + 11);
  const pos = document.offsetAt(position);
  if (tempEnd < 0 || pos > tempEnd) {
    return null;
  }
  const posLeft = temp.slice(0, pos).lastIndexOf(">");
  const posRight = temp.slice(pos, tempEnd + 11).indexOf("<");
  if (posLeft < 0 || posRight < 0) {
    return null;
  }
  const rangeLeft = text.slice(posLeft + 1, pos);
  const rangeRight = text.slice(pos, pos + posRight);
  if (rangeLeft.includes("<") || rangeRight.includes(">")) {
    return null;
  }
  return keys.map(key => {
    const item = new vscode.CompletionItem(
      key,
      vscode.CompletionItemKind.Property
    );
    item.detail = "小程序组件";
    item.documentation = `<${key}>|</${key}>`;
    item.insertText = new vscode.SnippetString(`<${key}>$1</${key}>`);
    return item;
  });
}

function resolveCompletionItem() {
  return null;
}
