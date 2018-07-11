
import { android as androidApp } from 'tns-core-modules/application';
import {HttpClient} from "./httpClient";

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
    console.log('callServerProtectedByClientAuthentication');
    console.log("host: ", this.host);
    let allRequest = this.host + "/";
    this.yapeOkHttpClient = new HttpClient(this.application, this.serverCertificate, this.clientCertificate);
    console.log("this.yapeOkHttpClient ", JSON.stringify(this.yapeOkHttpClient));
    let request = new okhttp3.Request.Builder().url(allRequest).build();

    this.makeRequest(request);

  }

  makeRequest(request): any {
    console.log("makeRequest: ", request);
    try {
      this.yapeOkHttpClient.getYapeOkHttpClient().newCall(request).enqueue(new okhttp3.Callback({
        onFailure: (call, e) => {
          console.log("onFailure", e.getMessage());
          call.cancel();
        },
        onResponse: (call, response) => {
          let testResult: string = response.body().string();
          console.log("Response Result: ", testResult);

        }
      }));
    } catch (error) {
      console.error('nativescript-mutual-tls > yapeOkHttpClient.getYapeOkHttpClient().newCall(request) error ', error);
    }

  }


}
