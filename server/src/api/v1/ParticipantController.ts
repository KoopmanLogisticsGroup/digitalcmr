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
import {Config} from '../../config/index';
import {Query} from '../../blockchain/Queries';
import {IdentityManager} from '../../blockchain/IdentityManager';
import {Identity, User} from '../../interfaces/entity.inferface';
import {ComposerConnectionMiddleware} from '../../middleware/ComposerConnectionMiddleware';
import {ErrorFactory} from '../../error/ErrorFactory';
import {ErrorType} from '../../error/ErrorType';

@JsonController('/participant')
@UseBefore(UserAuthenticatorMiddleware, ComposerConnectionMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class OrganizationController {
  public constructor(private transactionHandler: TransactionHandler,
                     private identityManager: IdentityManager) {
  }

  @Get('/legalowner/admin/')
  public async getAllLegalOwnerAdmins(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllLegalOwnerAdmins).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/legalowner/admin/userID/:userID')
  public async getLegalOwnerAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Single, Query.GetLegalOwnerAdminByUserID,
      {userID: userID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/legalowner/admin/organization/:org')
  public async getLegalOwnerAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetLegalOwnerAdminByOrg, {org: org}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/compound/admin/')
  public async getAllCompoundAdmins(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllCompoundAdmins).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/compound/admin/userID/:userID')
  public async getCompoundAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Single, Query.GetCompoundAdminByUserID,
      {userID: userID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/compound/admin/organization/:org')
  public async getCompoundAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetCompoundAdminByOrg, {org: org}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/carrier/admin/')
  public async getAllCarrierAdmins(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllCarrierAdmins).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/carrier/admin/userID/:userID')
  public async getCarrierAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Single, Query.GetCarrierAdminByUserID,
      {userID: userID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/carrier/admin/organization/:org')
  public async getCarrierAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetCarrierAdminByOrg, {org: org}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/carrier/member/')
  public async getAllCarrierMembers(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllCarrierMembers).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/carrier/member/userID/:userID')
  public async getCarrierMemberByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Single, Query.GetCarrierMemberByUserID,
      {userID: userID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/carrier/member/organization/:org')
  public async getCarrierMemberByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetCarrierMemberByOrg, {org: org}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/recipient/admin/')
  public async getAllRecipientAdmins(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllRecipientAdmins).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/recipient/admin/userID/:userID')
  public async getRecipientAdminByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Single, Query.GetRecipientAdminByUserID,
      {userID: userID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/recipient/admin/organization/:org')
  public async getRecipientAdminByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetRecipientAdminByOrg, {org: org}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/recipient/member/')
  public async getAllRecipientMembers(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllRecipientMembers).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/recipient/member/userID/:userID')
  public async getRecipientMemberByUserID(@Param('userID') userID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Single, Query.GetRecipientMemberByUserID,
      {userID: userID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/recipient/member/organization/:org')
  public async getRecipientMemberByOrg(@Param('org') org: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetRecipientMemberByOrg, {org: org}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Post('/')
  public async addParticipant(@Body() user: User, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    const entity = {
      participant: {
        $class:        user.role,
        participantID: 'userID',
        org:           user.orgType + '#' + user.orgID,
        userID:        user.username,
        userName:      user.username,
        firstName:     user.firstName,
        lastName:      user.lastName,
        address:       user.address,
      },
      identity:    {
        userID:     user.username,
        userSecret: ''
      },
      userApp:     {
        username:  user.username,
        password:  user.password,
        firstName: user.firstName,
        lastName:  user.lastName,
        role:      user.role
      }
    };

    return await this.identityManager.addEntity(identity, entity).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.identityAddError, error));
    });
  }
}
