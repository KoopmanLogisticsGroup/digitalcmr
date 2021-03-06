import {Container} from 'typedi';
import {LoggerInstance} from 'winston';
import {DataService} from '../datasource/DataService';
import {LoggerFactory} from './logger/LoggerFactory';
import {TransactionHandler} from '../blockchain/TransactionHandler';
import {Config} from '../config/index';
import {LegalOwnerTransactor} from '../domain/orgs/legalOwner/LegalOwnerTransactor';
import {CompoundTransactor} from '../domain/orgs/compound/CompoundTransactor';
import {CarrierTransactor} from '../domain/orgs/carrier/CarrierTransactor';
import {RecipientTransactor} from '../domain/orgs/recipient/RecipientTransactor';
import {VehicleTransactor} from '../domain/vehicles/VehicleTransactor';
import {EcmrTransactor} from '../domain/ecmrs/EcmrTransactor';
import {BusinessNetworkHandler} from '../blockchain/BusinessNetworkHandler';
import {IdentityManager} from '../blockchain/IdentityManager';
import {TransportOrder} from '../interfaces/transportOrder.interface';
import {TransportOrderTransactor} from '../domain/transportOrder/TransportOrderTransactor';
import {Transaction} from '../blockchain/Transactions';
import {CreateEcmrs} from '../interfaces/createEcmrs.interface';
import {Ecmr} from '../interfaces/ecmr.interface';
import {Vehicle} from '../interfaces/vehicle.interface';
import {Identity, UserInfo} from '../interfaces/entity.inferface';
import {ConnectionFactory} from '../connections/ConnectionFactory';
import {ConnectionPoolManager} from '../connections/ConnectionPoolManager';
import {Connection} from '../connections/entities/Connection';

const privateData = require('../../resources/testData/privateData.json');
const sharedData = require('../../resources/testData/sharedData.json');

export class TestData {
  private logger: LoggerInstance = Container.get(LoggerFactory).get('TestData');
  private static adminIdentity: Identity = {userID: 'admin', userSecret: 'adminpw'};
  private businessNetworkHandler: BusinessNetworkHandler = Container.get(BusinessNetworkHandler);
  private transportOrderIDs: string[] = ['A12345ORDER', 'B12345ORDER'];
  private connectionPoolManager: ConnectionPoolManager = Container.get(ConnectionPoolManager);
  private connectionFactory: ConnectionFactory = Container.get(ConnectionFactory);
  private connection: Connection;

  public constructor(private transactionHandler: TransactionHandler,
                     private dataService: DataService,
                     private identityManager: IdentityManager) {
  }

  public async addTestData(): Promise<any> {
    this.logger.info('Adding TestData');
    if (!this.connectionPoolManager.userHasConnection(TestData.adminIdentity.userID)) {
      this.connection = await this.connectionFactory.create(TestData.adminIdentity);
      await this.connectionPoolManager.addConnection(TestData.adminIdentity.userID, this.connection);
    }

    if (privateData) {
      await this.addPrivateDataToDB();
    }

    try {
      await this.addEntities();
    } catch (error) {
      this.logger.error('Error adding entities', error);
    }

    if (sharedData && Object.keys(sharedData).length > 1) {
      try {
        await this.addSharedData();
        this.logger.info('Shared data added with success');
      } catch (error) {
        this.logger.error('Error adding shared data', error);
      }
    }
  }

  private async addSharedData(): Promise<any> {
    if (sharedData.organizations && sharedData.organizations.legalOwnerOrgs && sharedData.organizations.legalOwnerOrgs.length) {
      this.logger.info('Adding Legal Owner Org');
      try {
        await this.addOrgs(sharedData.organizations.legalOwnerOrgs, 'legalOwnerOrg');
      } catch (error) {
        this.logger.error('Error adding Legal Owner Org', error);
      }
    }
    if (sharedData.organizations && sharedData.organizations.compoundOrgs && sharedData.organizations.compoundOrgs.length) {
      this.logger.info('Adding Compound Org');
      try {
        await this.addOrgs(sharedData.organizations.compoundOrgs, 'compoundOrg');
      } catch (error) {
        this.logger.error('Error adding Compound Org', error);
      }
    }
    if (sharedData.organizations && sharedData.organizations.carrierOrgs && sharedData.organizations.carrierOrgs.length) {
      this.logger.info('Adding Carrier Org');
      try {
        await this.addOrgs(sharedData.organizations.carrierOrgs, 'carrierOrg');
      } catch (error) {
        this.logger.error('Error adding Carrier Org', error);
      }
    }
    if (sharedData.organizations && sharedData.organizations.recipientOrgs && sharedData.organizations.recipientOrgs.length) {
      this.logger.info('Adding Recipient Org');
      try {
        await this.addOrgs(sharedData.organizations.recipientOrgs, 'recipientOrg');
      } catch (error) {
        this.logger.error('Error adding Recipient Org', error);
      }
    }
    if (sharedData.vehicles && sharedData.vehicles.length) {
      this.logger.info('Adding Vehicles');
      try {
        await this.addVehicles(sharedData.vehicles);
      } catch (error) {
        this.logger.error('Error adding Vehicles', error);
      }
    }
    if (sharedData.transportOrders && sharedData.transportOrders.length) {
      this.logger.info('Adding Transport Orders');
      try {
        await this.addTransportOrders(sharedData.transportOrders);
      } catch (error) {
        this.logger.error('Error adding Transport Orders', error);
      }
    }
    if (sharedData.ecmrs) {
      this.logger.info('Adding Ecmrs');
      try {
        await this.addEcmrs(sharedData.ecmrs);
      } catch (error) {
        this.logger.error('Error adding Ecmrs', error);
      }
    }
  }

  private async addEntities(): Promise<any> {
    this.logger.info('Adding entities');

    let identities: Identity[] = [];

    for (const entity of sharedData.entities) {
      identities.push(await this.identityManager.addEntity(TestData.adminIdentity, entity));
    }

    return identities;
  }

  private async addOrgs(orgs: any[], orgClass: string): Promise<any> {
    let promises: Promise<any>[] = [];
    for (let org of orgs) {
      // get all the ecmrs contained in the vehicle
      switch (orgClass) {
        case 'legalOwnerOrg': {
          promises.push(this.transactionHandler.invoke(TestData.adminIdentity, this.connection, Config.settings.composer.namespace, Transaction.CreateLegalOwnerOrg, org, new LegalOwnerTransactor()));
          break;
        }

        case 'compoundOrg': {
          promises.push(this.transactionHandler.invoke(TestData.adminIdentity, this.connection, Config.settings.composer.namespace, Transaction.CreateCompoundOrg, org, new CompoundTransactor()));
          break;
        }

        case 'carrierOrg': {
          promises.push(this.transactionHandler.invoke(TestData.adminIdentity, this.connection, Config.settings.composer.namespace, Transaction.CreateCarrierOrg, org, new CarrierTransactor()));
          break;
        }

        case 'recipientOrg': {
          promises.push(this.transactionHandler.invoke(TestData.adminIdentity, this.connection, Config.settings.composer.namespace, Transaction.CreateRecipientOrg, org, new RecipientTransactor()));
          break;
        }
      }
    }
    return Promise.all(promises).then((result) => {
      return result;
    });
  }

  private async addVehicles(vehicles: Vehicle[]): Promise<any> {
    return this.transactionHandler.invoke(TestData.adminIdentity, this.connection, Config.settings.composer.namespace, Transaction.CreateVehicles, vehicles, new VehicleTransactor());
  }

  private async addEcmrs(ecmrs: Ecmr[]): Promise<any> {
    await this.transactionHandler.invoke(TestData.adminIdentity, this.connection, Config.settings.composer.namespace, Transaction.CreateEcmrs, <CreateEcmrs>{
      'orderID': this.transportOrderIDs[0],
      'ecmrs':   ecmrs.filter(ecmr => ecmr.orderID === this.transportOrderIDs[0])
    }, new EcmrTransactor());

    return this.transactionHandler.invoke(TestData.adminIdentity, this.connection, Config.settings.composer.namespace, Transaction.CreateEcmrs, <CreateEcmrs>{
      'orderID': this.transportOrderIDs[1],
      'ecmrs':   ecmrs.filter(ecmr => ecmr.orderID === this.transportOrderIDs[1])
    }, new EcmrTransactor());
  }

  private async addTransportOrders(transportOrders: TransportOrder[]): Promise<any> {
    return this.transactionHandler.invoke(TestData.adminIdentity, this.connection, Config.settings.composer.namespace, Transaction.CreateTransportOrders, transportOrders, new TransportOrderTransactor());
  }

  public async addAdmin(adminUser: UserInfo): Promise<any> {
    this.logger.debug('Adding admin user');

    const adminIdentity: Identity = {
      userID:     'admin',
      userSecret: 'adminpw'
    };

    return await new IdentityManager('org.hyperledger.composer.system').addAdmin(adminIdentity, adminUser);
  }

  private async addPrivateDataToDB(): Promise<any> {
    try {
      const result = await this.dataService.addPrivateData(privateData);
      this.logger.info('Private data added');
      return result;
    } catch (error) {
      this.logger.error('Error adding private data', error);
    }
  }
}
