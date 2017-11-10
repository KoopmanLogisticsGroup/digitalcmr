import {
  Body,
  Get,
  JsonController,
  Post,
  Req,
  UseAfter,
  UseInterceptor,
  Param,
  Put, UseBefore
} from 'routing-controllers';
import {ErrorHandlerMiddleware, ComposerInterceptor, UserAuthenticatorMiddleware} from '../../middleware';
import {JSONWebToken} from '../../utils/authentication/JSONWebToken';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Identity} from '../../domain/Identity';
import {Config} from '../../config/index';
import {EcmrTransactor} from '../../domain/ecmrs/EcmrTransactor';

@JsonController('/ECMR')
@UseBefore(UserAuthenticatorMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class ECMRController {
  public constructor(private transactionHandler: TransactionHandler,
                     private ecmrTransactor: EcmrTransactor) {
  }

  @Get('/')
  public async getAllEcmrs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getAllEcmrs');
  }

  @Get('/ecmrID/:ecmrID')
  public async getEcmrByEcmrID(@Param('ecmrID') ecmrID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getEcmrById', {ecmrID: ecmrID});
  }

  @Get('/status/:ecmrStatus')
  public async getAllEcmrsByStatus(@Param('ecmrStatus') ecmrStatus: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getEcmrsByStatus', {status: ecmrStatus});
  }

  @Get('/vehicle/vin/:vin')
  public async getAllEcmrsFromVehicleByVin(@Param('vin') vin: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.ecmrTransactor.getEcmrsByVin(this.transactionHandler, identity, Config.settings.composer.profile, vin);
  }

  @Get('/vehicle/plateNumber/:plateNumber')
  public async getAllEcmrsFromVehicleByPlateNumber(@Param('plateNumber') plateNumber: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.ecmrTransactor.getEcmrsByPlateNumber(this.transactionHandler, identity, Config.settings.composer.profile, plateNumber);
  }

  @Post('/')
  public async create(@Body() ecmr: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.create(identity, Config.settings.composer.profile, Config.settings.composer.namespace, ecmr, new EcmrTransactor());
  }

  @Put('/')
  public async update(@Body() ecmr: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();
    const ip                 = request.ip;

    return await this.transactionHandler.update(identity, Config.settings.composer.profile, Config.settings.composer.namespace, ecmr, ecmr.ecmrID, new EcmrTransactor());
  }
}
