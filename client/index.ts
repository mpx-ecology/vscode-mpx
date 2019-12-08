import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    // 服务端配置
    let serverModule = context.asAbsolutePath(
        path.join('server', 'dist', 'server.js')
    );
    
    let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

    let serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    };

    // 客户端配置
    let clientOptions: LanguageClientOptions = {
        // js代码触发事情
        documentSelector: [{ scheme: 'file', language: 'mpx' }],
    };

    client = new LanguageClient(
        'DemoLanguageServer',
        'Demo Language Server',
        serverOptions,
        clientOptions
    );
    console.log('sssss');
    // 启动客户端，同时启动语言服务器
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}