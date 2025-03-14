import {
  createConnection,
  InitializeParams,
  InitializeResult
} from "vscode-languageserver";
import { VLS } from "./services/vls";

const connection =
  process.argv.length <= 2
    ? createConnection(process.stdin, process.stdout)
    : createConnection();

console.log = (a: any, f = false) => {
  if (f) {
    return connection.console.log(a);
  }
  connection.console.log(JSON.stringify(a));
};
console.error = connection.console.error.bind(connection.console);
const vls = new VLS(connection);

connection.onInitialize(
  async (params: InitializeParams): Promise<InitializeResult> => {
    await vls.init(params);

    console.log("mpx initialized");

    return {
      capabilities: vls.capabilities
    };
  }
);

vls.listen();
