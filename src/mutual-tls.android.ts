
import { android as androidApp } from 'tns-core-modules/application';
import {HttpClient} from "./httpClient.android";

declare const java: any;

export class MutualTls  {
  private application: android.app.Application;
  private serverCertificate: java.io.InputStream;
  private clientCertificate: java.io.InputStream;
  private host: string;
  private yapeOkHttpClient: HttpClient;

  constructor(host: string, application: any) {
    this.host = host;
    this.application = application;
  }

  setServerCertificate(serverCertificate: java.io.InputStream): void {
    this.serverCertificate = serverCertificate;
  }

  setClientCertificate(clientCertificate: java.io.InputStream): void {
    this.clientCertificate = clientCertificate;
  }

  callServerProtectedByClientAuthentication(): void {
    let allRequest = this.host + "/";
    this.yapeOkHttpClient = new HttpClient(this.application, this.serverCertificate, this.clientCertificate);
    let request = new okhttp3.Request.Builder().url(allRequest).build();

  }

  makeRequest(request): any {

    try {
      this.yapeOkHttpClient.getYapeOkHttpClient().newCall(request).enqueue(new okhttp3.Callback({
        onFailure: (call, e) => {
          console.log("onFailure", e.getMessage());
          call.cancel();
        },
        onResponse: (call, response) => {
          let testResult: string = response.body().string();
          console.log("MUTUALSSL", testResult);

        }
      }));
    } catch (error) {
      console.error('nativescript-mutual-tls > yapeOkHttpClient.getYapeOkHttpClient().newCall(request) error ', error);
    }

  }


}
