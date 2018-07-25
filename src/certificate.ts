import { File, Folder, knownFolders, path } from 'file-system';
import {WPathCert} from "./interfaces";
import {Utils} from "./util";

const FOLDER_NAME_CERT = 'certs';
const SERVER_NAME_CERT = 'server.crt';
const CLIENT_NAME_CERT = 'client.p12';

const  dir = knownFolders.currentApp().getFolder(FOLDER_NAME_CERT);

export class Certificate  {
  private _path: WPathCert = {server: null, client: null};

  constructor() {
  }

  private loadClientPath(): void {
    this._path.client = dir.getFile(CLIENT_NAME_CERT).path;
  }

  private loadServerPath(): void {
    this._path.server = dir.getFile(SERVER_NAME_CERT).path;
  }

  createClientCert(): java.io.FileInputStream {
    this.loadClientPath();
    if (!Utils.isValidatePath(this._path.client)) throw "Error: Client Directory empty or null"; // clientCertificate;
    return Utils.File(this._path.client);
  }

  createServerCert(): java.io.FileInputStream {
    this.loadServerPath();
    if (!Utils.isValidatePath(this._path.server)) throw "Error: Server Directory empty or null"; // serverCertificate;
    return Utils.File(this._path.server);
  }

}