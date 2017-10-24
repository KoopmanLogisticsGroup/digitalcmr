import {DBSource} from './DBSource';
import {CouchDBSource} from './CouchDBSource';
import {LoggerInstance} from 'winston';
import {Container} from 'typedi';
import {LoggerFactory} from '../utils/logger/LoggerFactory';

export class DataService {
  private db: DBSource;
  private couchDB: CouchDBSource;
  private logger: LoggerInstance = Container.get(LoggerFactory).get('DataService');

  private async initDB(dbName: string): Promise<CouchDBSource> {
    return new Promise((resolve: (result: CouchDBSource) => void, reject: (error: Error) => void) => {
      this.couchDB = new CouchDBSource();
      this.couchDB.createDatabase(dbName).then((result) => {
        this.couchDB.connectToDatabase(dbName);
        resolve(this.couchDB);
      }).catch((error) => {
        this.logger.warn('An error occurred while creating the database ' + dbName, error.message);
        let connect = this.couchDB.connectToDatabase(dbName);
        if (connect) {
          this.logger.info('Connected to database: ' + dbName);
          resolve(this.couchDB);
        } else {
          reject(new Error('It was not possible to connect to database: ' + dbName));
        }
      });
    });
  }

  public async putDocuments(dbName: string, documents: any[], documentIDs?: string[]): Promise<any> {
    this.db = await this.initDB(dbName);
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      if (documentIDs && (documents.length !== documentIDs.length)) {
        return reject(new Error('Incorrect number of IDs provided'));
      }

      let promises: Promise<any>[] = [];

      documents.forEach((document: any, index: number) => {
        if (documentIDs) {
          promises.push(this.db.put(document, documentIDs[index]));
        } else {
          promises.push(this.db.put(document));
        }
      });

      return Promise.all(promises)
        .then((documentsIDs: string[]) => {
          resolve(documentsIDs);
        })
        .catch((error) => {
          reject(new Error('Put documents: It was not possible to put documents. ' + error.message));
        });
    });
  }

  public async putDocument(dbName: string, document: any, documentID?: string): Promise<any> {
    this.db = await this.initDB(dbName);
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let promise: Promise<any>;
      if (documentID) {
        promise = this.db.put(document, documentID);
      } else {
        promise = this.db.put(document);
      }

      promise
        .then((documentID: string) => {
          resolve(documentID);
        })
        .catch((error) => {
          reject(new Error('Put document: It was not possible to put documents. ' + error.message));
        });
    });
  }

  public async updateDocument(dbName: string, documentID: string, document: any): Promise<any> {
    this.db = await this.initDB(dbName);

    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      if (!documentID) {
        return reject(new Error('No document ID provided'));
      }

      this.db.update(documentID, document).then((docID) => {
        resolve(docID);
      }).catch((error) => {
        reject(new Error('Update document: It was not possible to update document. ' + error.message));
      });
    });
  }

  public async deleteDocument(dbName: string, documentID: string): Promise<any> {
    this.db = await this.initDB(dbName);

    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      if (!documentID) {
        return reject(new Error('No document ID provided'));
      }

      this.db.delete(documentID).then((documentID) => {
        resolve(documentID);
      }).catch((error) => {
        reject(new Error('Update document: It was not possible to update document. ' + error.message));
      });
    });
  }

  public async getDocument(dbName: string, documentID: string): Promise<any> {
    this.db = await this.initDB(dbName);

    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      this.db.get(documentID).then((document: any) => {
        resolve(document);
      }).catch((error) => {
        reject(new Error('Get document: It was not possible to get document. ' + error.message));
      });
    });
  }

  public async getDocuments(dbName: string, documentIDs: string[]): Promise<any> {
    this.db = await this.initDB(dbName);

    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let promises: Promise<any>[] = [];
      for (const documentID of documentIDs) {
        promises.push(this.db.get(documentID));
      }

      return Promise.all(promises)
        .then((documents: any) => {
          resolve(documents);
        }).catch((error) => {
          reject(new Error('Get documents: It was not possible to get documents. ' + error.message));
        });
    });
  }

  public async getAllDocuments(dbName: string): Promise<any> {
    this.db = await this.initDB(dbName);

    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      this.db.all().then((docs) => {
          resolve(docs);
        }
      ).catch((error) => {
        reject(new Error('Get List: It was not possible to get list of docs. ' + error.message));
      });
    });
  }

  public async addPrivateData(testData: any): Promise<any> {
    let promises: Promise<any>[] = [];
    for (const key of Object.keys(testData)) {
      // create database
      this.db = await this.initDB(key);
      for (let item of testData[key]) {
        promises.push(this.putDocument(key, item, item[Object.keys(item)[0]]));
      }
    }

    return Promise.all(promises);
  }
}
