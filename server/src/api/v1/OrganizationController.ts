import {
  Body,
  Get,
  JsonController,
  Post,
  Req,
  UseAfter,
  UseInterceptor,
  Param,
  UseBefore
} from 'routing-controllers';
import {ErrorHandlerMiddleware, ComposerInterceptor, UserAuthenticatorMiddleware} from '../../middleware';
import {JSONWebToken} from '../../utils/authentication/JSONWebToken';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Identity} from '../../domain/Identity';
import {Config} from '../../config/index';
import {LegalOwnerTransactor} from '../../domain/orgs/legalOwner/LegalOwnerTransactor';
import {CompoundTransactor} from '../../domain/orgs/compound/CompoundTransactor';
import {CarrierTransactor} from '../../domain/orgs/carrier/CarrierTransactor';
import {RecipientTransactor} from '../../domain/orgs/recipient/RecipientTransactor';

@JsonController('/organization')
@UseBefore(UserAuthenticatorMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class OrganizationController {
  public constructor(private transactionHandler: TransactionHandler) {
  }

  @Get('/legalowner/')
  public async getAllLegalOwnerOrgs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getAllLegalOwnerOrgs');
  }

  @Get('/legalowner/entityID/:entityID')
  public async getLegalOwnerOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getLegalOwnerOrgByEntityID', {entityID: entityID});
  }

  @Get('/legalowner/name/:name')
  public async getLegalOwnerOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getLegalOwnerOrgByName', {name: name});
  }

  @Get('/compound/')
  public async getAllCompoundOrgs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getAllCompoundOrgs');
  }

  @Get('/compound/entityID/:entityID')
  public async getCompoundOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getCompoundOrgByEntityID', {entityID: entityID});
  }

  @Get('/compound/name/:name')
  public async getCompoundOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getCompoundOrgByName', {name: name});
  }

  @Get('/carrier/')
  public async getAllCarrierOrgs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getAllCarrierOrgs');
  }

  @Get('/carrier/entityID/:entityID')
  public async getCarrierOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getCarrierOrgByEntityID', {entityID: entityID});
  }

  @Get('/carrier/name/:name')
  public async getCarrierOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getCarrierOrgByName', {name: name});
  }

  @Get('/recipient/')
  public async getAllRecipientOrgs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getAllRecipientOrgs');
  }

  @Get('/recipient/entityID/:entityID')
  public async getRecipientOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getRecipientOrgByEntityID', {entityID: entityID});
  }

  @Get('/recipient/name/:name')
  public async getRecipientOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getRecipientOrgByName', {name: name});
  }

  @Post('/legalowner/')
  public async createLegalOwnerOrg(@Body() legalOwnerOrg: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.create(identity, Config.settings.composer.profile, Config.settings.composer.namespace, legalOwnerOrg, new LegalOwnerTransactor());
  }

  @Post('/compound/')
  public async createCompoundOrg(@Body() compoundOrg: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.create(identity, Config.settings.composer.profile, Config.settings.composer.namespace, compoundOrg, new CompoundTransactor());
  }

  @Post('/carrier/')
  public async createCarrierOrg(@Body() carrierOrg: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.create(identity, Config.settings.composer.profile, Config.settings.composer.namespace, carrierOrg, new CarrierTransactor());
  }

  @Post('/recipient/')
  public async createRecipientOrg(@Body() recipientOrg: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.create(identity, Config.settings.composer.profile, Config.settings.composer.namespace, recipientOrg, new RecipientTransactor());
  }
}