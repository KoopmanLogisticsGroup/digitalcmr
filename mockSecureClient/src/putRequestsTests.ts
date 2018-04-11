import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';

export class PutRequestsTests {
  private httpPort: number = 8080;
  private httpsPort: number = 443;

  public requestOptions: any = {
    hostname: 'localhost',
    port:     this.httpsPort,
    path:     '/api/v1/ECMR/status/LOADED',
    method:   'PUT',
    checkServerIdentity: (host, cert) => {
      return undefined;
    },
    headers:  this.setHeader(this.token),
    key:      fs.readFileSync('./sslForClient/validCertificates/private/koopman-key.pem'),
    cert:     fs.readFileSync('./sslForClient/validCertificates/certs/koopman-crt.pem'),
    ca:       fs.readFileSync('./sslForClient/validCertificates/certs/ca-cert.pem')
  };

  public constructor(private token: string) {
  }

  public async runTests(): Promise<void> {
    let result: any;

//
//  Case 6: Get items from the database
//

    console.log('testing PUT with correct information');
    try {
      result = await this.doHTTPSRequest(this.requestOptions);
      if (result) {
        console.log('\x1b[32m ✓ got back a result from PUT: \n', result);
        console.log('\x1b[0m');
      }
    } catch (err) {
      console.log(' \x1b[31m ✗ error occured while getting items from the blockchain: ', err);
      console.log('\x1b[0m');
    }

//
//  Case 7: PUT items from the wrong port
//
    let requestOptionsWithWrongPort = Object.assign({}, this.requestOptions);
    requestOptionsWithWrongPort.port = this.httpPort;

    console.log('testing PUT on the wrong port');
    try {
      result = await this.doHTTPSRequest(requestOptionsWithWrongPort);
      if (result) {
        console.log('\x1b[31m ✗ got back a result from PUT, should not have happened');
        console.log('\x1b[0m');
      }
    } catch (err) {
      if (err.toString().indexOf('Error: socket hang up') !== -1) {
        console.log('\x1b[32m ✓ no response on getting items from the wrong port');
        console.log('\x1b[0m');
      } else {
        console.log(' \x1b[31m ✗ error occured while getting items from the blockchain: ', err);
        console.log('\x1b[0m');
      }
    }

//
//  Case 8: Try getting items with no certificates
//
    let requestOptionsWithoutCertifications = {
      hostname: this.requestOptions.hostname,
      port:     this.requestOptions.port,
      path:     this.requestOptions.path,
      method:   this.requestOptions.method,
      headers:  this.requestOptions.headers,
      ca:       this.requestOptions.ca
    };

    console.log('testing PUT with missing certificates information');
    try {
      result = await this.doHTTPSRequest(requestOptionsWithoutCertifications);
      if (result) {
        console.log('\x1b[31m ✗ got back a result from PUT, should not have happened');
        console.log('\x1b[0m');
      }
    } catch (err) {
      if (err.toString().indexOf('alert handshake failure:') !== -1) {
        console.log('\x1b[32m ✓ no certificates send, ssl handshake fails');
        console.log('\x1b[0m');
      } else {
        console.log(' \x1b[31m ✗ error occured while getting items from the blockchain: ', err);
        console.log('\x1b[0m');
      }
    }

//
//  Case 9: try to PUT items with wrong certificates
//
    let requestWithWrongCertificates = Object.assign({}, this.requestOptions);
    requestWithWrongCertificates.key =      fs.readFileSync('./sslForClient/invalidCertificates/private/client1-key.pem');
    requestWithWrongCertificates.cert =     fs.readFileSync('./sslForClient/invalidCertificates/certs/client1-wrongcacrt.pem');

    console.log('testing PUT with wrong certificates');
    try {
      result = await this.doHTTPSRequest(requestWithWrongCertificates);
      if (result) {
        console.log('\x1b[31m ✗ got back a result from PUT, should not have happened');
        console.log('\x1b[0m');
      }
    } catch (err) {
      if (err.toString().indexOf('socket hang up') !== -1) {
        console.log('\x1b[32m ✓ could not PUT a connection with wrong certificates in place');
        console.log('\x1b[0m');
      } else {
        console.log(' \x1b[31m ✗ error occured while getting items from the blockchain: ', err);
        console.log('\x1b[0m');
      }
    }

//
//  Case 10: PUT items with the wrong ca
//
    let requestWithWrongCA = Object.assign({}, this.requestOptions);
    requestWithWrongCA.ca =       fs.readFileSync('./sslForClient/invalidCertificates/certs/ca-crt.pem');

    console.log('testing PUT with wrong ca');
    try {
      result = await this.doHTTPSRequest(requestWithWrongCA);
      if (result) {
        console.log('\x1b[31m ✗ got back a result from PUT, should not have happened');
        console.log('\x1b[0m');
      }
    } catch (err) {
      if (err.toString().indexOf('self signed certificate in certificate chain') !== -1) {
        console.log('\x1b[32m ✓ could not PUT a connection with wrong ca in place');
        console.log('\x1b[0m');
      } else {
        console.log(' \x1b[31m ✗ error occured while getting items from the blockchain: ', err);
        console.log('\x1b[0m');
      }
    }

//
//  Case 11: normal http POST request, should give an error
//
    let requestHTTPOptions = {
      hostname: this.requestOptions.hostname,
      port:     this.httpPort,
      path:     this.requestOptions.path,
      method:   this.requestOptions.method,
      headers:  this.requestOptions.headers,
    };

    result = await this.doHTTPRequest(requestHTTPOptions);

    console.log('normal HTTP PUT request, should be erroring: \n ', result);
  }

  private setHeader(token: string): any {
    const headers: any = {
      'x-access-token': token || 'test',
      'Content-Type':   'application/json'
    };

    return headers;
  }

  public async doHTTPSRequest(requestOptions: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let req = https.request(requestOptions, (res) => {
        res.on('data', (data) => {
          resolve(data.toString() + '\n');
        });
      });

      req.end();

      req.on('error', (err) => {
        reject(err);
      });
    });
  }

  public async doHTTPRequest(requestOptions: any): Promise<any> {
    return new Promise<any>((resolve) => {
      let req = http.request(requestOptions, (res) => {
        res.on('data', (data) => {
          resolve(data.toString() + '\n');
        });
      });

      req.end();

      req.on('error', (err) => {
        resolve(err);
      });
    });
  }
}