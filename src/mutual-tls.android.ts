
import { android as androidApp } from 'tns-core-modules/application';
import {HttpClient} from "./httpClient";

declare const java: any;

export interface WPathCert {
  server: string;
  client: string;
}

export interface WHeader {
  name: string;
  value: string;
}

export class Utils {

  static File(name: string): java.io.FileInputStream {
    let clientFile = new java.io.File(name);
    return new java.io.FileInputStream(clientFile);
  }

  static isValidatePath(path: string): boolean {
   if (path === null || path.length === 0) return false;
   return true;
  }

  static isValidateMethod(method: string): boolean {
    return true;
  }
}

export const methods = {
  'GET': 'GET',
  'HEAD': 'HEAD',
  'DELETE': 'DELETE',
  'POST': 'POST',
  'PUT': 'PUT',
};

export class MutualTls  {
  private _application: android.app.Application;
  private _serverCertificate: java.io.InputStream;
  private _path: WPathCert;
  private _clientCertificate: java.io.InputStream;
  private _url: string;
  private yapeOkHttpClient: HttpClient;
  private _headers: WHeader[] = [];
  private _body: any;

  constructor(application, pathCert: WPathCert) {
    this._application = application;
    this._path = pathCert;
  }

  create(): MutualTls {
    try {
      this.createClientCert();
      this.createServerCert();
      this.build();
    } catch (error) {
      throw `Error to create the client and server cert : ${error}`;
    }
    return this;
  }

  url(url: string): MutualTls {
    this._url = url;
    return this;
  }

  body(body: any): MutualTls {
    this._body = body;
    return this;
  }

  addHeader(header: WHeader): MutualTls {
    this._headers.push(header);
    return this;
  }

  post(): MutualTls {
    let request: okhttp3.Request = this.createRequest(methods.POST);
    this.makeRequest(request);
    return this;
  }

  get(): MutualTls {
    let request: okhttp3.Request = this.createRequest(methods.GET);
    this.makeRequest(request);
    return this;
  }

  private createRequest(method: string): okhttp3.Request {
    if (!Utils.isValidateMethod(method)) throw `Error: ${method} is invalid`;

    let request = new okhttp3.Request.Builder()
      .url(this._url)
      .method(method, null); // .post(this.createBody());

    if (this._headers && this._headers.length > 0) {
      this._headers.forEach(function (header) {
        request.addHeader(header.name, header.value);
      });
    }

    return request.build();
  }

  private createBody(): okhttp3.RequestBody {
    try {
      console.log("this._body");
      console.log(JSON.stringify(this._body));
      let jsonMediaType = okhttp3.MediaType.parse("application/json; charset=utf-8");
      let body = JSON.stringify(this._body || {});
      return okhttp3.RequestBody.create(
        jsonMediaType,
        body
      );
    } catch (error) {
      throw `Error to parse the json body ${error}`;
    }
  }

  private createClientCert(): void {
    if (!Utils.isValidatePath(this._path.client)) throw "Error: Client Directory empty or null"; // clientCertificate;
    this._clientCertificate = Utils.File(this._path.client);
  }

  private createServerCert(): void {
    if (!Utils.isValidatePath(this._path.server)) throw "Error: Server Directory empty or null"; // serverCertificate;
    this._serverCertificate = Utils.File(this._path.server);
  }

  private build(): void {
    this.yapeOkHttpClient = new HttpClient(this._application, this._serverCertificate, this._clientCertificate);
  }

  private makeRequest(request): any {
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
          alert("Response Result: \n" + testResult);

        }
      }));
    } catch (error) {
      console.error('nativescript-mutual-tls > yapeOkHttpClient.getYapeOkHttpClient().newCall(request) error ', error);
    }

  }


}
