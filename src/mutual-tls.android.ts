
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

  static ValidatePath(path: string): boolean{
   if (path.length === 0 || path === null) return false;
   return true;
  }

  static ValidateMethod(method: string): boolean {
    return true;
  }
}

export const methods = {
  'GET': 'get',
  'HEAD': 'head',
  'DELETE': 'delete',
  'POST': 'post',
  'PUT': 'put',
  'PATCH': 'patch',
};

export class MutualTls  {
  private _application: android.app.Application;
  private _serverCertificate: java.io.InputStream;
  private _path: WPathCert;
  private _clientCertificate: java.io.InputStream;
  private _url: string;
  private yapeOkHttpClient: HttpClient;
  private _headers: WHeader[];
  private _body: any;

  constructor({application = null, pathCert= {server: '', client: ''}}) {
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

  private createRequest(method: string): okhttp3.Request {
    if (Utils.ValidateMethod(method)) throw `Error: ${method} is invalid`;

    let request = new okhttp3.Request.Builder()
      .url(this._url)
      .method(method, this.createBody()); // .post(this.createBody());

    if (this._headers) {
      Object.keys(this._headers).forEach(function (key) {
        request.addHeader(key, this._headers[key] as any);
      });
    }

    return request.build();
  }

  private createBody(): okhttp3.RequestBody {
    try {
      let jsonMediaType = okhttp3.MediaType.parse("application/json; charset=utf-8");
      let body = JSON.stringify(this.body || {});
      return okhttp3.RequestBody.create(
        jsonMediaType,
        body
      );
    } catch (error) {
      throw `Error to parse the json body ${error}`;
    }
  }

  private createClientCert(): void {
    if (Utils.ValidatePath(this._path.client)) throw "Error: Client Directory empty or null"; // clientCertificate;
    this._clientCertificate = Utils.File(this._path.client);
  }

  private createServerCert(): void {
    if (Utils.ValidatePath(this._path.server)) throw "Error: Server Directory empty or null"; // serverCertificate;
    this._serverCertificate = Utils.File(this._path.server);
  }

  private build(): void {
    this.yapeOkHttpClient = new HttpClient(this._application, this._serverCertificate, this._clientCertificate);
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
          alert("Response Result: \n" + testResult);

        }
      }));
    } catch (error) {
      console.error('nativescript-mutual-tls > yapeOkHttpClient.getYapeOkHttpClient().newCall(request) error ', error);
    }

  }


}
