import {Connection} from './entities/Connection';
import {CronJob} from 'cron';
import {isUndefined} from 'util';
import {LoggerInstance} from 'winston';
import {LoggerFactory} from '../utils/logger/LoggerFactory';
import {Container} from 'typedi';

export const connectionMaxAge            = 3600000;
export const cronPatternCleanConnections = '*/20 * * * *'; //at every 20 minutes

export class ConnectionPoolManager {
  private logger: LoggerInstance;
  private connectionPool: Map<string, Connection> = new Map<string, Connection>();
  private cleanConnectionsJob: any;

  public constructor() {
    this.logger = Container.get(LoggerFactory).get('ConnectionPoolManager');

    try {
      this.cleanConnectionsJob = new CronJob(cronPatternCleanConnections, this.cleanConnections);
    } catch (invalidCronJobPatternError) {
      this.logger.error(cronPatternCleanConnections + ': invalid cron pattern; Job has not been registered');
    }
  }

  public addConnection(userID: string, connection: Connection): void {
    if (!this.connectionPool.get(userID)) {
      this.connectionPool.set(userID, connection);
    }
  }

  public userHasConnection(userID: string): boolean {
    return this.connectionPool.has(userID);
  }

  public getConnection(userID: string): Connection {
    const connection = this.connectionPool.get(userID);

    if (!connection) {
      throw new Error('No connection defined for this user');
    }

    if (this.isConnectionExpired(connection)) {
      this.connectionPool.delete(userID);

      throw new Error('Connection for ' + userID + ' has expired');
    }

    return connection;
  }

  private cleanConnections(): void {
    for (let userID of this.connectionPool.keys()) {
      let connection = this.connectionPool.get(userID);
      if (this.isConnectionExpired(connection)) {
        this.connectionPool.delete(userID);
      }
    }
  }

  private isConnectionExpired(connection?: Connection): boolean {
    return !isUndefined(connection) &&
      new Date().getTime() - connection.getCreatedTs() > connectionMaxAge;
  }
}
