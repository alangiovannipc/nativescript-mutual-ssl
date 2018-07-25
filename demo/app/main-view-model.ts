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
    let host: string = "https://192.168.1.33/identity/login/start";
    let context: any = androidApp.nativeApp;

    let dir = knownFolders.currentApp().getFolder('certs');
    let serverCertificate = dir.getFile('server.crt').path;
    let clientCertificate = dir.getFile('client.p12').path;

    console.log("clientCertificate => " + clientCertificate);
    console.log("serverCertificate => " + serverCertificate);

    this.mutualTls = new MutualTls(context, { server: serverCertificate, client: clientCertificate});

    this.mutualTls
      .create()
      .url(host)
      .body({})
      .addHeader({name: 'Auth', value: '2323232323'})
      .get();

  }
}
