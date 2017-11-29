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
import {Queries} from '../../blockchain/Queries';

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

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Queries.GetAllLegalOwnerOrgs);
  }

  @Get('/legalowner/entityID/:entityID')
  public async getLegalOwnerOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Queries.GetLegalOwnerOrgByEntityID,
      {entityID: entityID});
  }

  @Get('/legalowner/name/:name')
  public async getLegalOwnerOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Queries.GetLegalOwnerOrgByName, {name: name});
  }

  @Get('/compound/')
  public async getAllCompoundOrgs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Queries.GetAllCompoundOrgs);
  }

  @Get('/compound/entityID/:entityID')
  public async getCompoundOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Queries.GetCompoundOrgByEntityID,
      {entityID: entityID});
  }

  @Get('/compound/name/:name')
  public async getCompoundOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Queries.GetCompoundOrgByName, {name: name});
  }

  @Get('/carrier/')
  public async getAllCarrierOrgs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Queries.GetAllCarrierOrgs);
  }

  @Get('/carrier/entityID/:entityID')
  public async getCarrierOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Queries.GetCarrierOrgByEntityID,
      {entityID: entityID});
  }

  @Get('/carrier/name/:name')
  public async getCarrierOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Queries.GetCarrierOrgByName, {name: name});
  }

  @Get('/recipient/')
  public async getAllRecipientOrgs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Queries.GetAllRecipientOrgs);
  }

  @Get('/recipient/entityID/:entityID')
  public async getRecipientOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Queries.GetRecipientOrgByEntityID,
      {entityID: entityID});
  }

  @Get('/recipient/name/:name')
  public async getRecipientOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Queries.GetRecipientOrgByName, {name: name});
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
