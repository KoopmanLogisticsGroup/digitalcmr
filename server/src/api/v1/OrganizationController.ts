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
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Config} from '../../config/index';
import {LegalOwnerTransactor} from '../../domain/orgs/legalOwner/LegalOwnerTransactor';
import {CompoundTransactor} from '../../domain/orgs/compound/CompoundTransactor';
import {CarrierTransactor} from '../../domain/orgs/carrier/CarrierTransactor';
import {RecipientTransactor} from '../../domain/orgs/recipient/RecipientTransactor';
import {Transaction} from '../../blockchain/Transactions';
import {Query} from '../../blockchain/Queries';
import {ComposerConnectionMiddleware} from '../../middleware/ComposerConnectionMiddleware';
import {ErrorFactory} from '../../error/ErrorFactory';
import {ErrorType} from '../../error/ErrorType';

@JsonController('/organization')
@UseBefore(UserAuthenticatorMiddleware, ComposerConnectionMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class OrganizationController {
  public constructor(private transactionHandler: TransactionHandler) {
  }

  @Get('/legalowner/')
  public async getAllLegalOwnerOrgs(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetAllLegalOwnerOrgs).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/legalowner/entityID/:entityID')
  public async getLegalOwnerOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.findOne(request.identity, request.connection, Query.GetLegalOwnerOrgByEntityID,
      {entityID: entityID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.findOneError, error));
    });
  }

  @Get('/legalowner/name/:name')
  public async getLegalOwnerOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetLegalOwnerOrgByName, {name: name}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/compound/')
  public async getAllCompoundOrgs(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetAllCompoundOrgs).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.findOneError, error));
    });
  }

  @Get('/compound/entityID/:entityID')
  public async getCompoundOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetCompoundOrgByEntityID,
      {entityID: entityID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/compound/name/:name')
  public async getCompoundOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetCompoundOrgByName, {name: name}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/carrier/')
  public async getAllCarrierOrgs(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetAllCarrierOrgs).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/carrier/entityID/:entityID')
  public async getCarrierOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.findOne(request.identity, request.connection, Query.GetCarrierOrgByEntityID,
      {entityID: entityID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.findOneError, error));
    });
  }

  @Get('/carrier/name/:name')
  public async getCarrierOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetCarrierOrgByName, {name: name}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/recipient/')
  public async getAllRecipientOrgs(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetAllRecipientOrgs).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/recipient/entityID/:entityID')
  public async getRecipientOrgByEntityID(@Param('entityID') entityID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.findOne(request.identity, request.connection, Query.GetRecipientOrgByEntityID,
      {entityID: entityID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.findOneError, error));
    });
  }

  @Get('/recipient/name/:name')
  public async getRecipientOrgByName(@Param('name') name: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetRecipientOrgByName, {name: name}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Post('/legalowner/')
  public async createLegalOwnerOrg(@Body() legalOwnerOrg: any, @Req() request: any): Promise<any> {
    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.CreateLegalOwnerOrg, legalOwnerOrg, new LegalOwnerTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Post('/compound/')
  public async createCompoundOrg(@Body() compoundOrg: any, @Req() request: any): Promise<any> {
    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.CreateCompoundOrg, compoundOrg, new CompoundTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Post('/carrier/')
  public async createCarrierOrg(@Body() carrierOrg: any, @Req() request: any): Promise<any> {
    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.CreateCarrierOrg, carrierOrg, new CarrierTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Post('/recipient/')
  public async createRecipientOrg(@Body() recipientOrg: any, @Req() request: any): Promise<any> {
    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.CreateRecipientOrg, recipientOrg, new RecipientTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }
}
