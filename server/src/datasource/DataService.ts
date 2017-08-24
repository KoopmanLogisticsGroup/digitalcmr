import {DBSource} from './DBSource';
import {CouchDBSource} from './CouchDBSource';

export class DataService {
  private db: DBSource;
  private couchDB: CouchDBSource;
  private dbName: string;

  public constructor() {
    this.dbName = 'db';
    this.initDB().then((result) => {
      console.log('DB initialized');
      this.db = this.couchDB;
    }).catch(this.printError);
  }

  private async initDB(): Promise<CouchDBSource> {
    return new Promise((resolve: (result: CouchDBSource) => void, reject: (error: Error) => void) => {
      this.couchDB = new CouchDBSource();
      this.couchDB.createDatabase(this.dbName).then((result) => {
        this.couchDB.connectToDatabase(this.dbName);
        resolve(this.couchDB);
      }).catch((error) => {
        let connect = this.couchDB.connectToDatabase(this.dbName);
        if (connect) {
          console.log('Test init: Connected to database: ' + this.dbName);
          resolve(this.couchDB);
        } else {
          let err     = new Error();
          err.message = 'Test init failed: It was not possible to connect to database: ' + this.dbName;
          reject(err);
        }
      });
    });
  }

  public async putDocuments(documents: any[], ID?: string): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let idArr: string[] = [];
      let done            = 0;
      for (let i = 0; i < documents.length; i++) {
        this.db.put(documents[i], ID).then((documentID) => {
          idArr.push(documentID);
          done++;
          if (done === documents.length) {
            resolve(idArr);
          }
        }).catch((error) => {
          let err     = new Error();
          err.message = 'Put documents: It was not possible to put documents. ' + error.message;
          reject(err);
        });
      }
    });
  }

  public async updateDocument(documentID: string, document: any): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      if (!documentID) {
        let err     = new Error();
        err.message = 'No document ID provided';
        reject(err);
      }
      this.db.update(document).then((documentID) => {
        resolve(documentID);
      }).catch((error) => {
        let err     = new Error();
        err.message = 'Update document: It was not possible to update document. ' + error.message;
        reject(err);
      });
    });
  }

  public async deleteDocument(documentID: string): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      if (!documentID) {
        let err     = new Error();
        err.message = 'No document ID provided';
        reject(err);
      }
      this.db.delete(documentID).then((documentID) => {
        resolve(documentID);
      }).catch((error) => {
        let err     = new Error();
        err.message = 'Update document: It was not possible to update document. ' + error.message;
        reject(err);
      });
    });
  }

  public async getDocuments(idArr: string[]): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let documentArr: any[] = [];
      let done               = 0;
      for (let i = 0; i < idArr.length; i++) {
        this.db.get(idArr[i]).then((document) => {
          done++;
          documentArr.push(document.resource);
          if (done === idArr.length) {
            resolve(documentArr);
          }
        }).catch((error) => {
          let err     = new Error();
          err.message = 'Get documents: It was not possible to get documents. ' + error.message;
          reject(err);
        });
      }
    });
  }

  public async addTestData(testData: any): Promise<any> {
    let promises: Promise<any>[] = [];
    for (let key in testData) {
      if (testData.hasOwnProperty(key)) {
        for (let item of testData[key]) {
          let doc  = {};
          doc[key] = item;
          promises.push(await this.putDocuments([doc], item[Object.keys(item)[0]]));
        }
      }
    }
    return Promise.all(promises);
  }

  private printError(error: any): void {
    console.log(error);
  }
}
