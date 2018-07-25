import { Common } from './mutual-tls.common';
export declare class MutualTls {
  constructor(pathCert);
  create(): MutualTls;
  url(url: string): MutualTls;
  body(body: any): MutualTls;
  addHeader(header: any): MutualTls;
  post(): MutualTls;
  get(): MutualTls;
}
