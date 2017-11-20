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
import {QueryReturnType, TransactionHandler} from '../../blockchain/TransactionHandler';
import {Identity} from '../../domain/Identity';
import {Config} from '../../config/index';
import {LegalOwnerTransactor} from '../../domain/orgs/legalOwner/LegalOwnerTransactor';
import {CompoundTransactor} from '../../domain/orgs/compound/CompoundTransactor';
import {CarrierTransactor} from '../../domain/orgs/carrier/CarrierTransactor';
import {RecipientTransactor} from '../../domain/orgs/recipient/RecipientTransactor';
import {Transaction} from '../../blockchain/Transactions';

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

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, 'getAllLegalOwnerOrgs');
  }

  @Get('/legalowner/entityID/:entityID')
  public async getLegalOwnerOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, 'getLegalOwnerOrgByEntityID',
      {entityID: entityID});
  }

  @Get('/legalowner/name/:name')
  public async getLegalOwnerOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, 'getLegalOwnerOrgByName', {name: name});
  }

  @Get('/compound/')
  public async getAllCompoundOrgs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, 'getAllCompoundOrgs');
  }

  @Get('/compound/entityID/:entityID')
  public async getCompoundOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, 'getCompoundOrgByEntityID',
      {entityID: entityID});
  }

  @Get('/compound/name/:name')
  public async getCompoundOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, 'getCompoundOrgByName', {name: name});
  }

  @Get('/carrier/')
  public async getAllCarrierOrgs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, 'getAllCarrierOrgs');
  }

  @Get('/carrier/entityID/:entityID')
  public async getCarrierOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, 'getCarrierOrgByEntityID',
      {entityID: entityID});
  }

  @Get('/carrier/name/:name')
  public async getCarrierOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, 'getCarrierOrgByName', {name: name});
  }

  @Get('/recipient/')
  public async getAllRecipientOrgs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, 'getAllRecipientOrgs');
  }

  @Get('/recipient/entityID/:entityID')
  public async getRecipientOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, 'getRecipientOrgByEntityID',
      {entityID: entityID});
  }

  @Get('/recipient/name/:name')
  public async getRecipientOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, 'getRecipientOrgByName', {name: name});
  }

  @Post('/legalowner/')
  public async createLegalOwnerOrg(@Body() legalOwnerOrg: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.CreateLegalOwnerOrg, legalOwnerOrg, new LegalOwnerTransactor());
  }

  @Post('/compound/')
  public async createCompoundOrg(@Body() compoundOrg: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.CreateCompoundOrg, compoundOrg, new CompoundTransactor());
  }

  @Post('/carrier/')
  public async createCarrierOrg(@Body() carrierOrg: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.CreateCarrierOrg, carrierOrg, new CarrierTransactor());
  }

  @Post('/recipient/')
  public async createRecipientOrg(@Body() recipientOrg: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.CreateRecipientOrg, recipientOrg, new RecipientTransactor());
  }
}
