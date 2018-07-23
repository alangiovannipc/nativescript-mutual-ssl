import { Observable } from 'tns-core-modules/data/observable';
import { MutualTls } from 'nativescript-mutual-tls';
import { android as androidApp } from 'tns-core-modules/application';
import { File, Folder, knownFolders, path } from 'file-system';

export class HelloWorldModel extends Observable {
  public message: string;
  private mutualTls: MutualTls;

  constructor() {
    super();
    // this.message = this.mutualTls.message;
  }

  test(): void {
    let host: string = "https://192.168.1.34/index.json";
    let context: any = androidApp.nativeApp;
    this.mutualTls = new MutualTls(host, context);

    let dir = knownFolders.currentApp().getFolder('certs');
    let serverCertificate = dir.getFile('server.crt').path;
    let clientCertificate = dir.getFile('client.p12').path;

    let serverCertificateInputStream: java.io.FileInputStream;
    let clientCertificateInputStream: java.io.FileInputStream;

    // ServerCertification
    let serverFile = new java.io.File(serverCertificate);
    serverCertificateInputStream = new java.io.FileInputStream(serverFile);

    // CLientCertification
    let clientFile = new java.io.File(clientCertificate);
    clientCertificateInputStream = new java.io.FileInputStream(clientFile);


    this.mutualTls.setServerCertificate(serverCertificateInputStream);
    this.mutualTls.setClientCertificate(clientCertificateInputStream);
    this.mutualTls.callServerProtectedByClientAuthentication();
  }
}
