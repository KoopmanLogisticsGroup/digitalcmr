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

@JsonController('/participant')
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class OrganizationController {
  private queryApi: QueryApi;
  private assetRegistry: string;

  public constructor(private _transactor: TransactionHandler) {
    const apiFactory   = Container.get(ApiFactory);
    this.queryApi      = apiFactory.get(QueryApi);
    this.assetRegistry = 'Participant';
    this._transactor   = new TransactionHandler();
  }

  @Get('/legalowner/admin/')
  public async getAllLegalOwnerAdmins(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const participants = await this._transactor.executeQuery('getAllLegalOwnerAdmins', enrollmentID, secret);
    return participants;
  }

  @Get('/legalowner/admin/userID/:userID')
  public async getLegalOwnerAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const participants = await this._transactor.executeQuery('getLegalOwnerAdminByUserID', enrollmentID, secret, {userID: userID});
    return participants;
  }

  @Get('/legalowner/admin/organization/:org')
  public async getLegalOwnerAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const participants = await this._transactor.executeQuery('getLegalOwnerAdminByOrg', enrollmentID, secret, {org: org});
    return participants;
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