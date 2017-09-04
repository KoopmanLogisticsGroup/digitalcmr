import {
  Body,
  Get,
  JsonController,
  Post,
  Req,
  UseAfter,
  UseInterceptor,
  Param,
  UseBefore,
  Put
} from 'routing-controllers';
import {Container} from 'typedi';
import {ApiFactory} from '../../utils';
import {LegalOwnerOrg, CompoundOrg, RecipientOrg, CarrierOrg, QueryApi} from '../../sdk/api';
import {ErrorHandlerMiddleware, ComposerInterceptor, TransactionHandler} from '../../middleware';
import {JSONWebToken} from '../../utils/auth/JSONWebToken';

@JsonController('/organization')
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class OrganizationController {
  private queryApi: QueryApi;
  private assetRegistry: string;

  public constructor(private _transactor: TransactionHandler) {
    const apiFactory   = Container.get(ApiFactory);
    this.queryApi      = apiFactory.get(QueryApi);
    this.assetRegistry = 'Entity';
    this._transactor   = new TransactionHandler();
  }

  @Get('/legalowner/')
  public async getAllLegalOwnerOrgs(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getAllLegalOwnerOrgs', enrollmentID, secret);
    return orgs;
  }

  @Get('/legalowner/entityID/:entityID')
  public async getLegalOwnerOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getLegalOwnerOrgByEntityID', enrollmentID, secret, {entityID: entityID});
    return orgs;
  }

  @Get('/legalowner/name/:name')
  public async getLegalOwnerOrgByName(@Param('name') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getLegalOwnerOrgByName', enrollmentID, secret, {name: name});
    return orgs;
  }

  @Get('/compound/')
  public async getAllCompoundOrgs(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getAllCompoundOrgs', enrollmentID, secret);
    return orgs;
  }

  @Get('/compound/entityID/:entityID')
  public async getCompoundOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getCompoundOrgByEntityID', enrollmentID, secret, {entityID: entityID});
    return orgs;
  }

  @Get('/compound/name/:name')
  public async getCompoundOrgByName(@Param('name') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getCompoundOrgByName', enrollmentID, secret, {name: name});
    return orgs;
  }

  @Get('/carrier/')
  public async getAllCarrierOrgs(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getAllCarrierOrgs', enrollmentID, secret);
    return orgs;
  }

  @Get('/carrier/entityID/:entityID')
  public async getCarrierOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getCarrierOrgByEntityID', enrollmentID, secret, {entityID: entityID});
    return orgs;
  }

  @Get('/carrier/name/:name')
  public async getCarrierOrgByName(@Param('name') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getCarrierOrgByName', enrollmentID, secret, {name: name});
    return orgs;
  }

  @Get('/recipient/')
  public async getAllRecipientOrgs(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getAllRecipientOrgs', enrollmentID, secret);
    return orgs;
  }

  @Get('/recipient/entityID/:entityID')
  public async getRecipientOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getRecipientOrgByEntityID', enrollmentID, secret, {entityID: entityID});
    return orgs;
  }

  @Get('/recipient/name/:name')
  public async getRecipientOrgByName(@Param('name') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const orgs = await this._transactor.executeQuery('getRecipientOrgByName', enrollmentID, secret, {name: name});
    return orgs;
  }
  // @Post('/')
  // public async create(@Body() ecmr: ECMR, @Req() request: any): Promise<any> {
  //   let enrollmentID = new JSONWebToken(request).getUserID();
  //   let secret       = new JSONWebToken(request).getSecret();
  //
  //   return this._transactor.put(ecmr, enrollmentID, secret, (factory, data) => this._transactor.createECMR(factory, data, enrollmentID));
  // }
  //
  // @Put('/')
  // public async update(@Body() ecmr: ECMR, @Req() request: any): Promise<any> {
  //   let enrollmentID = new JSONWebToken(request).getUserID();
  //   let secret       = new JSONWebToken(request).getSecret();
  //   const ip         = request.ip;
  //   return this._transactor.put(ecmr, enrollmentID, secret, (factory, data) => this._transactor.updateECMR(factory, data, enrollmentID, ip));
  // }
}