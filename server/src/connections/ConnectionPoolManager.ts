import {Connection} from './entities/Connection';

export class ConnectionPoolManager {
  private connectionPool: { [key: string]: Connection } = {};

  public addConnection(userID: string, connection: Connection): void {
    if (!this.connectionPool[userID]) {
      this.connectionPool[userID] = connection;
    }
  }

  public userHasConnection(userID: string): boolean {
    return userID in this.connectionPool;
  }

  public getConnection(userID: string): Connection {
    if (!this.connectionPool[userID]) {
      throw new Error('No connection defined for this user');
    }

    return this.connectionPool[userID];
  }
}
