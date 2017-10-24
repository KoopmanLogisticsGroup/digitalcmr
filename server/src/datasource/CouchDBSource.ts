import {DBSource} from './DBSource';
import * as shortid from 'shortid';
import * as nano from 'nano';
import {BulkFetchDocsWrapper, ServerScope} from 'nano';
import {Config} from '../config';

const dbHostname               = Config.settings.privateDB.host;
const dbPort                   = Config.settings.privateDB.port;
const dbConnector: ServerScope = nano('http://' + dbHostname + ':' + dbPort) as ServerScope;

export class CouchDBSource implements DBSource {
  private _dbName: string;

  public get dbName(): string {
    return this._dbName;
  }

  public set dbName(value: string) {
    this._dbName = value;
  }

  public connectToDatabase(databaseName: string): any {
    this.dbName = databaseName;

    return dbConnector.db.use(databaseName);
  }

  public async createDatabase(databaseName: string): Promise<any> {
    return new Promise((resolve: () => void, reject: (error: Error) => void) => {
      dbConnector.db.create(databaseName, (error: Error) => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }

  public async deleteDatabase(databaseName: string): Promise<any> {
    return new Promise((resolve: () => void, reject: (error: Error) => void) => {
      dbConnector.db.destroy(databaseName, (error) => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }

  public async put(resource: any, ID?: string): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let collection = dbConnector.use(this.dbName);
      if (!ID) {
        ID = shortid.generate();
      }

      collection.insert({resource}, ID, (error: Error, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result.id);
      });
    });
  }

  public async get(resourceID: string): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let collection = dbConnector.use(this.dbName);
      collection.get(resourceID, (error: Error, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result.resource);
      });
    });
  }

  public async all(): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let collection = dbConnector.use(this.dbName);
      collection.list((error: any, list: any) => {
        if (error) {
          return reject(error);
        }

        let documentIDs: BulkFetchDocsWrapper = {keys: []};
        documentIDs.keys                      = list.rows.map(document => document.id);
        collection.fetch(documentIDs, (error: any, result: any) => {
          if (error) {
            return reject(error);
          }

          const documents = result.rows.map(entry => entry.doc.resource);
          resolve(documents);
        });
      });
    });
  }

  public async delete(resourceID: string): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let collection = dbConnector.use(this.dbName);
      collection.get(resourceID, (error: any, document: any) => {
        if (error) {
          return reject(error);
        }

        collection.destroy(resourceID, document._rev, (error: Error, result: any) => {
          if (error) {
            return reject(error);
          }

          resolve(result.id);
        });
      });
    });
  }

  public async update(resourceID: string, resource: any): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let collection = dbConnector.use(this.dbName);
      collection.get(resourceID, (error: any, document: any) => {
        if (error) {
          return reject(error);
        }

        document.resource = resource;
        collection.insert(document, resourceID, (error: any, result: any) => {
          if (error) {
            return reject(error);
          }

          resolve(result.id);
        });
      });
    });
  }
}
