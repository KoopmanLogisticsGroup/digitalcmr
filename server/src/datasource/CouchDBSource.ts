import {DBSource} from './DBSource';
import * as shortid from 'shortid';

const dbHostname = process.env.DB_HOSTNAME || 'couchdb-private';
const dbPort     = process.env.DB_PORT || '5984';
let nano         = require('nano')('http://' + dbHostname + ':' + dbPort);

const emit = (key: any, value: any) => undefined;

export class CouchDBSource implements DBSource {

  private dbName: string;

  private setDbName(dbName: string): void {
    this.dbName = dbName;
  }

  public connectToDatabase(databaseName: string): any {
    this.setDbName(databaseName);
    return nano.db.use(databaseName);
  }

  public async createDatabase(databaseName: string): Promise<boolean> {
    return new Promise((resolve: (result: boolean) => void, reject: (error: Error) => void) => {
      nano.db.create(databaseName, (error) => {
        if (error) {
          if (error.statusCode) {
            switch (error.statusCode.toString()) {
              case '412' : {
                console.log('Nano: database ' + databaseName + ' already exists');
                break;
              }
              default : {
                console.log('Nano: an error occurred while creating the database ' + databaseName);
                console.log(error);
              }
            }
          }
          reject(error);
        } else {
          console.log('Nano: created database ' + databaseName);
          resolve(true);
        }
      });
    });
  }

  public async deleteDatabase(databaseName: string): Promise<boolean> {
    return new Promise((resolve: (result: boolean) => void, reject: (error: Error) => void) => {
      nano.db.destroy(databaseName, (error) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });
  }

  public async put(resource: any, ID?: string): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let use  = nano.use(this.dbName);
      let body = {
        resource
      };
      if (!ID) {
        ID = shortid.generate();
      }
      use.insert(body, ID, (error) => {
        if (error) {
          reject(error);
        }
        resolve(body);
      });
    });
  }

  public async get (resourceID: string): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let use = nano.use(this.dbName);
      use.get(resourceID, (error: any, dbResource: any) => {
        if (error) {
          reject(error);
        }
        resolve(dbResource);
      });
    });
  }

  public async delete(resourceID: string): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let use = nano.use(this.dbName);
      use.get(resourceID, (error: any, dbResource: any) => {
        if (error) {
          reject(error);
        }
        use.destroy(resourceID, dbResource._rev, (error) => {
          if (error) {
            reject(error);
          }
          resolve(resourceID);
        });
      });
    });
  }

  public async update(resource: any): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let use  = nano.use(this.dbName);
      let body = {
        resource
      };
      use.get(resource.id, (error: any, dbResource: any) => {
        if (error && error.statusCode !== 404) {
          reject(error);
        }
        if (dbResource) {
          use.destroy(resource.id, dbResource._rev, (error) => {
            if (error) {
              reject(error);
            }
            use.insert(body, resource.id, (error) => {
              if (error) {
                reject(error);
              }
              resolve(body);
            });
          });
        } else {
          use.insert(body, resource.id, (error) => {
            if (error) {
              reject(error);
            }
            resolve(body);
          });
        }
      });
    });
  }
}
