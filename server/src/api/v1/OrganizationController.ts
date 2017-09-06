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

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getAllLegalOwnerOrgs', enrollmentID, secret);

    return result;
  }

  @Get('/legalowner/entityID/:entityID')
  public async getLegalOwnerOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getLegalOwnerOrgByEntityID', enrollmentID, secret, {entityID: entityID});

    return result;
  }

  @Get('/legalowner/name/:name')
  public async getLegalOwnerOrgByName(@Param('name') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getLegalOwnerOrgByName', enrollmentID, secret, {name: name});

    return result;
  }

  @Get('/compound/')
  public async getAllCompoundOrgs(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getAllCompoundOrgs', enrollmentID, secret);

    return result;
  }

  @Get('/compound/entityID/:entityID')
  public async getCompoundOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getCompoundOrgByEntityID', enrollmentID, secret, {entityID: entityID});

    return result;
  }

  @Get('/compound/name/:name')
  public async getCompoundOrgByName(@Param('name') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getCompoundOrgByName', enrollmentID, secret, {name: name});

    return result;
  }

  @Get('/carrier/')
  public async getAllCarrierOrgs(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getAllCarrierOrgs', enrollmentID, secret);

    return result;
  }

  @Get('/carrier/entityID/:entityID')
  public async getCarrierOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getCarrierOrgByEntityID', enrollmentID, secret, {entityID: entityID});

    return result;
  }

  @Get('/carrier/name/:name')
  public async getCarrierOrgByName(@Param('name') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getCarrierOrgByName', enrollmentID, secret, {name: name});

    return result;
  }

  @Get('/recipient/')
  public async getAllRecipientOrgs(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getAllRecipientOrgs', enrollmentID, secret);

    return result;
  }

  @Get('/recipient/entityID/:entityID')
  public async getRecipientOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getRecipientOrgByEntityID', enrollmentID, secret, {entityID: entityID});

    return result;
  }

  @Get('/recipient/name/:name')
  public async getRecipientOrgByName(@Param('name') entityID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getRecipientOrgByName', enrollmentID, secret, {name: name});

    return result;
  }

  @Post('/legalowner/')
  public async createLegalOwnerOrg(@Body() legalOwnerOrg: LegalOwnerOrg, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    return this._transactor.put(legalOwnerOrg, enrollmentID, secret, (factory, data) => this._transactor.createLegalOwnerOrg(factory, data, enrollmentID));
  }

  @Post('/compound/')
  public async createCompoundOrg(@Body() compoundOrg: CompoundOrg, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.put(compoundOrg, enrollmentID, secret, (factory, data) => this._transactor.createCompoundOrg(factory, data, enrollmentID));

    return result;
  }

  @Post('/carrier/')
  public async createCarrierOrg(@Body() carrierOrg: CarrierOrg, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.put(carrierOrg, enrollmentID, secret, (factory, data) => this._transactor.createCarrierOrg(factory, data, enrollmentID));

    return result;
  }

  @Post('/recipient/')
  public async createRecipientOrg(@Body() recipientOrg: RecipientOrg, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.put(recipientOrg, enrollmentID, secret, (factory, data) => this._transactor.createRecipientOrg(factory, data, enrollmentID));

    return result;
  }

  // @Put('/')
  // public async update(@Body() ecmr: ECMR, @Req() request: any): Promise<any> {
  //   let enrollmentID = new JSONWebToken(request).getUserID();
  //   let secret       = new JSONWebToken(request).getSecret();
  //   const ip         = request.ip;
  //   return this._transactor.put(ecmr, enrollmentID, secret, (factory, data) => this._transactor.updateECMR(factory, data, enrollmentID, ip));
  // }
}