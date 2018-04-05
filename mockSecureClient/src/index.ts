import 'reflect-metadata';
import {GetRequestsTests} from './getRequestsTests';
import {PostRequestTests} from './postRequestTests';
import {PutRequestsTests} from './putRequestsTests';

class App {

  public async run(): Promise<void> {
    let token = await new PostRequestTests().runTests();

    await new GetRequestsTests(token).runTests();

    await new PutRequestsTests(token).runTests();

    console.log('done');
  }
}

new App().run().catch((error: Error) => {
  console.error('[!!!]', error.stack);
  process.exit(1);
});
