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
import {QueryApi} from '../../sdk/api';
import {ErrorHandlerMiddleware, ComposerInterceptor, TransactionHandler} from '../../middleware';
import {JSONWebToken} from '../../utils/auth/JSONWebToken';
import {Participant} from '../../entities/participant.model';
import {UsersService} from '../../services/users.service';

@JsonController('/participant')
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class OrganizationController {
  private queryApi: QueryApi;
  private assetRegistry: string;
  private userService: UsersService;

  public constructor(private _transactor: TransactionHandler) {
    const apiFactory   = Container.get(ApiFactory);
    this.queryApi      = apiFactory.get(QueryApi);
    this.assetRegistry = 'Participant';
    this._transactor   = new TransactionHandler();
    this.userService   = new UsersService();
  }

  @Get('/legalowner/admin/')
  public async getAllLegalOwnerAdmins(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getAllLegalOwnerAdmins', enrollmentID, secret);

    return result;
  }

  @Get('/legalowner/admin/userID/:userID')
  public async getLegalOwnerAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getLegalOwnerAdminByUserID', enrollmentID, secret, {userID: userID});

    return result;
  }

  @Get('/legalowner/admin/organization/:org')
  public async getLegalOwnerAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getLegalOwnerAdminByOrg', enrollmentID, secret, {org: org});

    return result;
  }

  @Get('/compound/admin/')
  public async getAllCompoundAdmins(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getAllCompoundAdmins', enrollmentID, secret);

    return result;
  }

  @Get('/compound/admin/userID/:userID')
  public async getCompoundAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getCompoundAdminByUserID', enrollmentID, secret, {userID: userID});

    return result;
  }

  @Get('/compound/admin/organization/:org')
  public async getCompoundAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getCompoundAdminByOrg', enrollmentID, secret, {org: org});

    return result;
  }

  @Get('/carrier/admin/')
  public async getAllCarrierAdmins(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getAllCarrierAdmins', enrollmentID, secret);

    return result;
  }

  @Get('/carrier/admin/userID/:userID')
  public async getCarrierAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getCarrierAdminByUserID', enrollmentID, secret, {userID: userID});

    return result;
  }

  @Get('/carrier/admin/organization/:org')
  public async getCarrierAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getCarrierAdminByOrg', enrollmentID, secret, {org: org});

    return result;
  }

  @Get('/carrier/member/')
  public async getAllCarrierMembers(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getAllCarrierMembers', enrollmentID, secret);

    return result;
  }

  @Get('/carrier/member/userID/:userID')
  public async getCarrierMemberByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getCarrierMemberByUserID', enrollmentID, secret, {userID: userID});

    return result;
  }

  @Get('/carrier/member/organization/:org')
  public async getCarrierMemberByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getCarrierMemberByOrg', enrollmentID, secret, {org: org});

    return result;
  }

  @Get('/recipient/admin/')
  public async getAllRecipientAdmins(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getAllRecipientAdmins', enrollmentID, secret);

    return result;
  }

  @Get('/recipient/admin/userID/:userID')
  public async getRecipientAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getRecipientAdminByUserID', enrollmentID, secret, {userID: userID});

    return result;
  }

  @Get('/recipient/admin/organization/:org')
  public async getRecipientAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getRecipientAdminByOrg', enrollmentID, secret, {org: org});

    return result;
  }

  @Get('/recipient/member/')
  public async getAllRecipientMembers(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getAllRecipientMembers', enrollmentID, secret);

    return result;
  }

  @Get('/recipient/member/userID/:userID')
  public async getRecipientMemberByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getRecipientMemberByUserID', enrollmentID, secret, {userID: userID});

    return result;
  }

  @Get('/recipient/member/organization/:org')
  public async getRecipientMemberByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    let result = {body: {}};

    result.body = await this._transactor.executeQuery('getRecipientMemberByOrg', enrollmentID, secret, {org: org});

    return result;
  }

  @Post('/')
  public async addParticipant(@Body() participant: any, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    if (!this.userService.isAdmin(enrollmentID, secret)) {
      return {body: 'Cannot issue participant. User is not admin.'};
    }
    return this.userService.addUser(new Participant(participant)).then((result) => {
      return {body: result};
    }).catch((error) => {
      return {body: error};
    });
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