import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';

export class PostRequestTests {
  private postheaders = {
    'Content-Type':   'application/json',
    'Content-Length': Buffer.byteLength(
      JSON.stringify({
        username: 'willem@amsterdamcompound.org',
        password: 'passw0rd'
      }), 'utf8')
  };
  private requestOptions: any = {
    hostname: 'localhost',
    port:     443,
    path:     '/api/v1/login',
    method:   'POST',
    headers:  this.postheaders,
    key:      fs.readFileSync('./sslForClient/validCertificates/private/koopman-key.pem'),
    cert:     fs.readFileSync('./sslForClient/validCertificates/certs/koopman-crt.pem'),
    ca:       fs.readFileSync('./sslForClient/validCertificates/certs/ca-cert.pem')
  };
  private token: string;


  public async runTests(): Promise<string> {
    //
    //  Case 1: successful call
    //

    let result = await this.doHTTPSRequest(this.requestOptions);
    this.token = JSON.parse(result).token;

    console.log('normal POST request with correct certifiactes');
    if (result.toString().indexOf('"success":true,"token":') !== -1) {
      console.log('\x1b[32m ✓ request successfully executed');
      console.log('\x1b[0m');
    } else {
      console.log(' \x1b[31m ✗ request failed: ', result);
      console.log('\x1b[0m');
    }

    //
    //  Case 2: wrong port
    //
    let requestOptionsWithWrongPort = Object.assign({}, this.requestOptions);
    requestOptionsWithWrongPort.port = 8080;

    result = await this.doHTTPSRequest(requestOptionsWithWrongPort);

    console.log('sending POST request with wrong port');
    if (result.toString().indexOf('socket hang up') !== -1) {
      console.log('\x1b[32m ✓ tried to connect to the wrong port and got a refused signal');
      console.log('\x1b[0m');
    } else {
      console.log(' \x1b[31m ✗ tried to connect to a port, but got an unexpected outcome: ', result);
      console.log('\x1b[0m');
    }

    //
    //  Case 3: certificates missing
    //
    let requestOptionsWithoutCertifications = {
      hostname: this.requestOptions.hostname,
      port:     this.requestOptions.port,
      path:     this.requestOptions.path,
      method:   this.requestOptions.method,
      headers:  this.requestOptions.headers,
      ca:       this.requestOptions.ca
    };

    result = await this.doHTTPSRequest(requestOptionsWithoutCertifications);

    console.log('testing POST without certificates being send within the request: ');
    if (result.toString().indexOf('routines:ssl3_read_bytes:sslv3 alert handshake failure') !== -1) {
      console.log('\x1b[32m ✓ no certificates send, ssl handshake fails');
      console.log('\x1b[0m');
    } else {
      console.log(' \x1b[31m ✗ no certificates send, but request is approved/given the following error: ', result);
      console.log('\x1b[0m');
    }

    //
    //  Case 4: wrong certificates used
    //
    let requestWithWrongCertificates = Object.assign({}, this.requestOptions);
    requestWithWrongCertificates.key =      fs.readFileSync('./sslForClient/invalidCertificates/private/client1-key.pem');
    requestWithWrongCertificates.cert =     fs.readFileSync('./sslForClient/invalidCertificates/certs/client1-wrongcacrt.pem');

    result = await this.doHTTPSRequest(requestWithWrongCertificates);

    console.log('testing POST with wrong certificate, should be ignored');
    if (result.toString().indexOf('socket hang up') !== -1) {
      console.log('\x1b[32m ✓ wrong certificate, request is being ignored ');
      console.log('\x1b[0m');
    } else {
      console.log(' \x1b[31m ✗ wrong certificate, but request finished: ', result);
      console.log('\x1b[0m');
    }

    //
    //  Case 4: wrong CA used
    //
    let requestWithWrongCA = Object.assign({}, this.requestOptions);
    requestWithWrongCA.ca =       fs.readFileSync('./sslForClient/invalidCertificates/certs/ca-crt.pem');

    result = await this.doHTTPSRequest(requestWithWrongCA);

    console.log('testing POST with wrong ca');
    if (result.toString().indexOf('self signed certificate in certificate chain') !== -1) {
      console.log('\x1b[32m ✓ wrong ca, request is being ignored');
      console.log('\x1b[0m');
    } else {
      console.log(' \x1b[31m ✗ wrong ca, but request finished: ', result);
      console.log('\x1b[0m');
    }

    //
    //  Case 5: normal http POST request, should give an error
    //
    let requestHTTPOptions = {
      hostname: this.requestOptions.hostname,
      port:     8080,
      path:     this.requestOptions.path,
      method:   this.requestOptions.method,
      headers:  this.requestOptions.headers,
    };

    result = await this.doHTTPRequest(requestHTTPOptions);

    console.log('normal HTTP POST request, should be erroring: \n ', result);

    return this.token;
  }

  public async doHTTPSRequest(requestOptions: any): Promise<any> {
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