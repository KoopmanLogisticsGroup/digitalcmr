import 'reflect-metadata';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';

class App {
  public async run(): Promise<void> {
    const postheaders = {
      'Content-Type':   'application/json',
      'Content-Length': Buffer.byteLength(
        JSON.stringify({
          username: 'willem@amsterdamcompound.org',
          password: 'passw0rd'
        }), 'utf8')
    };

    let requestOptions: any = {
      hostname: 'localhost',
      port:     8080,
      path:     '/api/v1/login',
      method:   'POST',
      headers:  postheaders,
      key:      fs.readFileSync('./sslForClient/validCertificates/private/koopman-key.pem'),
      cert:     fs.readFileSync('./sslForClient/validCertificates/certs/koopman-crt.pem'),
      ca:       fs.readFileSync('./sslForClient/validCertificates/certs/ca-cert.pem')
    };

    let result = await this.doRequest(requestOptions);

    console.log('normal request with correct certifiactes');
    if (result.toString().indexOf('success')) {
      console.log('\x1b[32m √ request successfully executed');
      console.log('\x1b[0m');
    } else {
      console.log(' \x1b[31m x request failed: ', result);
      console.log('\x1b[0m');
    }

    //should redirect
    requestOptions = {
      hostname: 'localhost',
      port:     440,
      path:     '/api/v1/login',
      method:   'POST',
      headers:  postheaders,
      key:      fs.readFileSync('./sslForClient/validCertificates/private/koopman-key.pem'),
      cert:     fs.readFileSync('./sslForClient/validCertificates/certs/koopman-crt.pem'),
      ca:       fs.readFileSync('./sslForClient/validCertificates/certs/ca-cert.pem')
    };

    result = await this.doRequest(requestOptions);

    console.log('sending request with wrong port');
    if (result.toString().indexOf('connect ECONNREFUSED')) {
      console.log('\x1b[32m √ tried to connect to the wrong port and got a refused signal');
      console.log('\x1b[0m');
    } else {
      console.log(' \x1b[31m x tried to connect to a port, but got an unexpected outcome: ', result);
      console.log('\x1b[0m');
    }

    //case two, certs missing
    requestOptions = {
      hostname: 'localhost',
      port:     8080,
      path:     '/api/v1/login',
      method:   'POST',
      headers:  postheaders,
      ca:       fs.readFileSync('./sslForClient/validCertificates/certs/ca-cert.pem')
    };

    result = await this.doRequest(requestOptions);

    console.log('testing without certificates being send within the request: ');
    if (result.toString().indexOf('routines:ssl3_read_bytes:sslv3 alert handshake failure')) {
      console.log('\x1b[32m √ no certificates send, ssl handshake fails');
      console.log('\x1b[0m');
    } else {
      console.log(' \x1b[31m x no certificates send, but request is approved/given the following error: ', result);
      console.log('\x1b[0m');
    }

    //case three, invalid certs
    requestOptions = {
      hostname: 'localhost',
      port:     8080,
      path:     '/api/v1/login',
      method:   'POST',
      headers:  postheaders,
      key:      fs.readFileSync('./sslForClient/invalidCertificates/private/client1-key.pem'),
      cert:     fs.readFileSync('./sslForClient/invalidCertificates/certs/client1-wrongcacrt.pem'),
      ca:       fs.readFileSync('./sslForClient/validCertificates/certs/ca-cert.pem')
    };

    result = await this.doRequest(requestOptions);

    console.log('testing with wrong certificate, should be ignored');
    if (result.toString().indexOf('socket hang up')) {
      console.log('\x1b[32m √ wrong certificate, request is being ignored ');
      console.log('\x1b[0m');
    } else {
      console.log(' \x1b[31m x wrong certificate, but request finished: ', result);
      console.log('\x1b[0m');
    }

    //case three, invalid ca
    requestOptions = {
      hostname: 'localhost',
      port:     8080,
      path:     '/api/v1/login',
      method:   'POST',
      headers:  postheaders,
      key:      fs.readFileSync('./sslForClient/validCertificates/private/koopman-key.pem'),
      cert:     fs.readFileSync('./sslForClient/validCertificates/certs/koopman-crt.pem'),
      ca:       fs.readFileSync('./sslForClient/invalidCertificates/certs/ca-crt.pem')
    };

    result = await this.doRequest(requestOptions);

    console.log('testing with wrong ca');
    if (result.toString().indexOf('self signed certificate in certificate chain')) {
      console.log('\x1b[32m √ wrong ca, request is being ignored');
      console.log('\x1b[0m');
    } else {
      console.log(' \x1b[31m x wrong ca, but request finished: ', result);
      console.log('\x1b[0m');
    }

    //case three, invalid ca
    requestOptions = {
      hostname: 'localhost',
      port:     8080,
      path:     '/api/v1/login',
      method:   'POST',
      headers:  postheaders,
    };

    result = await this.doHTTPRequest(requestOptions);

    console.log('normal HTTP request, should be erroring: \n ', result);
  }

  public async doRequest(requestOptions: any): Promise<any> {
    return new Promise<any>((resolve) => {
      let req = https.request(requestOptions, function (res) {
        res.on('data', function (data) {
          resolve(data.toString() + '\n');
        });
      });

      req.write(JSON.stringify({
        username: 'willem@amsterdamcompound.org',
        password: 'passw0rd'
      }));

      req.end();

      req.on('error', function (e) {
        resolve(e);
      });
    });
  }

  public async doHTTPRequest(requestOptions: any): Promise<any> {
    return new Promise<any>((resolve) => {
      let req = http.request(requestOptions, function (res) {
        res.on('data', function (data) {
          resolve(data.toString() + '\n');
        });
      });

      req.write(JSON.stringify({
        username: 'willem@amsterdamcompound.org',
        password: 'passw0rd'
      }));

      req.end();

      req.on('error', function (e) {
        resolve(e);
      });
    });
  }
}

new App().run().catch((error: Error) => {
  console.error('[!!!]', error.stack);
  process.exit(1);
});
