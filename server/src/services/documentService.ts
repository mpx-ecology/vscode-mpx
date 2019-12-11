import { IConnection, TextDocuments } from "vscode-languageserver";

/**
 * Service responsible for managing documents being syned through LSP
 * Todo - Switch to incremental sync
 */
export class DocumentService {
  private documents: TextDocuments;

  constructor(conn: IConnection) {
    this.documents = new TextDocuments();
    this.documents.listen(conn);
  }

  getDocument(uri: string) {
    return this.documents.get(uri);
  }

  getAllDocuments() {
    return this.documents.all();
  }

  get onDidChangeContent() {
    return this.documents.onDidChangeContent;
  }
  get onDidClose() {
    return this.documents.onDidClose;
  }
}
