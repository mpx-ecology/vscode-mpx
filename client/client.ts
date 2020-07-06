import * as vscode from 'vscode';
import {
  LanguageClient,
  RevealOutputChannelOn,
  ServerOptions,
  TransportKind,
  LanguageClientOptions
} from 'vscode-languageclient';
import { resolve } from 'path';
import { existsSync } from 'fs';

export function initializeLanguageClient(
  vlsModulePath: string,
  globalSnippetDir: string
): LanguageClient {
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6005'] };

  const documentSelector = ['mpx'];
  const config = vscode.workspace.getConfiguration();

  let serverPath;

  const devVlsPackagePath = config.get('mpx.dev.vlsPath', '');
  if (
    devVlsPackagePath &&
    devVlsPackagePath !== '' &&
    existsSync(devVlsPackagePath)
  ) {
    serverPath = resolve(devVlsPackagePath, 'dist/vueServerMain.js');
  } else {
    serverPath = vlsModulePath;
  }

  const runExecArgv: string[] = [];
  const vlsPort = config.get('mpx.dev.vlsPort');
  if (vlsPort !== -1) {
    runExecArgv.push(`--inspect=${vlsPort}`);
    console.log(`Will launch VLS in port: ${vlsPort}`);
  }

  const serverOptions: ServerOptions = {
    run: {
      module: serverPath,
      transport: TransportKind.ipc,
      options: { execArgv: runExecArgv }
    },
    debug: {
      module: serverPath,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector,
    synchronize: {
      configurationSection: [
        'mpx',
        'emmet',
        'html',
        'javascript',
        'typescript',
        'prettier',
        'stylusSupremacy'
      ],
      fileEvents: vscode.workspace.createFileSystemWatcher(
        '{**/*.js,**/*.ts}',
        false,
        false,
        true
      )
    },
    initializationOptions: {
      config,
      globalSnippetDir
    },
    revealOutputChannelOn: RevealOutputChannelOn.Never
  };

  return new LanguageClient(
    'mpx',
    'mpx Language Server',
    serverOptions,
    clientOptions
  );
}
