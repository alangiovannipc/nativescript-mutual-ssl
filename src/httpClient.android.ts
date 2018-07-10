
const KeyStore = java.security.KeyStore;
const KeyManagerFactory = javax.net.ssl.KeyManagerFactory;
const CertificateFactory = java.security.cert.CertificateFactory;

export class HttpClient  {
  private application: android.app.Application;
  private serverCertificate: java.io.InputStream;
  private clientCertificate: java.io.InputStream;

  constructor(application: any , serverCertificate: any, clientCertificate: any) {
    this.application = application;
    this.serverCertificate = serverCertificate;
    this.clientCertificate = clientCertificate;
  }

  getYapeOkHttpClient(): okhttp3.OkHttpClient {
    console.log("Start process getYapeOkHttpClient");
    let cacheSize: number = 30 * 1024 * 1024;
    let cache = new okhttp3.Cache(this.application.getCacheDir(), cacheSize);

    let trustManagerFactory = javax.net.ssl.TrustManagerFactory.getInstance(javax.net.ssl.TrustManagerFactory.getDefaultAlgorithm());
    let localKeystore = this.loadCaLocalCertificate(CertificateFactory, this.serverCertificate, KeyStore);
    let trustManager = this.addTrustManager(localKeystore, trustManagerFactory);
    let keyManagerFactory = this.loadClientCertificate(KeyStore, KeyManagerFactory);
    let sslSocketFactory = this.initializeSSLContext(keyManagerFactory, trustManagerFactory);

    return this.buildOkHttpClient(sslSocketFactory, trustManager, cache);
  }

  buildOkHttpClient(sslSocketFactory, trustManager, cache): any {
    console.log("Start buildOkHttpClient");
    let client = new okhttp3.OkHttpClient.Builder();

    try {
      client.hostnameVerifier(new javax.net.ssl.HostnameVerifier({
        verify: function(hostname: string, session: javax.net.ssl.ISSLSession): boolean {
          return true;
        },
      }));
    } catch (error) {
      console.error('nativescript-mutual-tls > client.validatesDomainName error', error);
    }

    try {
      client.sslSocketFactory(sslSocketFactory, trustManager);
    } catch (error) {
      console.error('nativescript-mutual-tls > client.sslSocketFactory error', error);
    }

    return client.cache(cache).build();
  }

  loadCaLocalCertificate(CertificateFactory, serverCertificate, KeyStore): any {
    console.log("Loading CA local");
    let ca: java.security.cert.Certificate;
    let cf = CertificateFactory.getInstance("X.509");
    let caInput = serverCertificate;
    try {
      ca = cf.generateCertificate(caInput);
    } finally {
      caInput.close();
    }

    let addCrtLocalToKeystore = KeyStore.getInstance(KeyStore.getDefaultType());
    addCrtLocalToKeystore.load(null, null);
    addCrtLocalToKeystore.setCertificateEntry("ca", ca);
    return addCrtLocalToKeystore;
  }

  addTrustManager(addCrtLocalToKeystore:any, trustManagerFactory: any): any {
    console.log("Add CA to the trustManager");
    trustManagerFactory.init(addCrtLocalToKeystore);
    let trustManagers: [any] = trustManagerFactory.getTrustManagers();
    let trustManager = trustManagers[0];
    return trustManager;
  }

  loadClientCertificate(KeyStore, KeyManagerFactory): any {
    console.log("Load client certificate");
    let keyStoreStream = this.clientCertificate;
    let keyStore = KeyStore.getInstance("PKCS12");
    keyStore.load(keyStoreStream, "topsecretclientp12".toString());

    let keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
    keyManagerFactory.init(keyStore, "topsecretclientp12".toString());
    return keyManagerFactory;
  }

  initializeSSLContext(keyManagerFactory, trustManagerFactory): any{
    console.log("initialize SSLContext");
    let sslContext = javax.net.ssl.SSLContext.getInstance("TLS");
    sslContext.init(keyManagerFactory.getKeyManagers(),
                    trustManagerFactory.getTrustManagers(),
                    new java.security.SecureRandom());
    return sslContext.getSocketFactory();
  }

}