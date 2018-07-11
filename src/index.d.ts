import { Common } from './mutual-tls.common';
export declare class MutualTls {
  constructor(host: string, application: any);
  setServerCertificate(serverCertificate: java.io.InputStream): void;
  setClientCertificate(clientCertificate: java.io.InputStream): void;
  callServerProtectedByClientAuthentication(): void;
}
