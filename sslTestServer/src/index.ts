import 'reflect-metadata';
import {LoggerInstance} from 'winston';
import * as fs from 'fs';
import * as https from 'https';

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
      key:      fs.readFileSync('./sslForClient/client1-key.pem'),
      cert:     fs.readFileSync('./sslForClient/client1-crt.pem'),
      ca:       fs.readFileSync('./sslForClient/ca-crt.pem')
    };

    let req = https.request(requestOptions, function (res) {
      console.log(res.statusCode);
      res.on('data', function (data) {
        process.stdout.write(data);
      });
    });

    req.write(JSON.stringify({
      username: 'willem@amsterdamcompound.org',
      password: 'passw0rd'
    }));

    req.end();

    req.on('error', function (e) {
      console.error(e);
    });
  }
}

new App().run().catch((error: Error) => {
  console.error('[!!!]', error.stack);
  process.exit(1);
});
