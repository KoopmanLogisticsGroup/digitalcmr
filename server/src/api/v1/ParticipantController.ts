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
import {Query} from '../../blockchain/Queries';

@JsonController('/participant')
@UseBefore(UserAuthenticatorMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class OrganizationController {
  public constructor(private transactionHandler: TransactionHandler) {
  }

  @Get('/legalowner/admin/')
  public async getAllLegalOwnerAdmins(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllLegalOwnerAdmins);
  }

  @Get('/legalowner/admin/userID/:userID')
  public async getLegalOwnerAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Query.GetLegalOwnerAdminByUserID,
      {userID: userID});
  }

  @Get('/legalowner/admin/organization/:org')
  public async getLegalOwnerAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetLegalOwnerAdminByOrg, {org: org});
  }

  @Get('/compound/admin/')
  public async getAllCompoundAdmins(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllCompoundAdmins);
  }

  @Get('/compound/admin/userID/:userID')
  public async getCompoundAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Query.GetCompoundAdminByUserID,
      {userID: userID});
  }

  @Get('/compound/admin/organization/:org')
  public async getCompoundAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetCompoundAdminByOrg, {org: org});
  }

  @Get('/carrier/admin/')
  public async getAllCarrierAdmins(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllCarrierAdmins);
  }

  @Get('/carrier/admin/userID/:userID')
  public async getCarrierAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Query.GetCarrierAdminByUserID,
      {userID: userID});
  }

  @Get('/carrier/admin/organization/:org')
  public async getCarrierAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetCarrierAdminByOrg, {org: org});
  }

  @Get('/carrier/member/')
  public async getAllCarrierMembers(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllCarrierMembers);
  }

  @Get('/carrier/member/userID/:userID')
  public async getCarrierMemberByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Query.GetCarrierMemberByUserID,
      {userID: userID});
  }

  @Get('/carrier/member/organization/:org')
  public async getCarrierMemberByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetCarrierMemberByOrg, {org: org});
  }

  @Get('/recipient/admin/')
  public async getAllRecipientAdmins(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllRecipientAdmins);
  }

  @Get('/recipient/admin/userID/:userID')
  public async getRecipientAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Query.GetRecipientAdminByUserID,
      {userID: userID});
  }

  @Get('/recipient/admin/organization/:org')
  public async getRecipientAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetRecipientAdminByOrg, {org: org});
  }

  @Get('/recipient/member/')
  public async getAllRecipientMembers(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllRecipientMembers);
  }

  @Get('/recipient/member/userID/:userID')
  public async getRecipientMemberByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Query.GetRecipientMemberByUserID,
      {userID: userID});
  }

  @Get('/recipient/member/organization/:org')
  public async getRecipientMemberByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetRecipientMemberByOrg, {org: org});
  }

  @Post('/')
  public async addParticipant(@Body() participant: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    // TODO create function
    // if (!this.userService.isAdmin(enrollmentID, secret)) {
    //   return 'Cannot issue participant. User is not admin.';
    // }
    // return this.userService.addUser(new Participant(participant)).then((result) => {
    //   return {result};
    // }).catch((error) => {
    //   return {error};
    // });
  }
}
