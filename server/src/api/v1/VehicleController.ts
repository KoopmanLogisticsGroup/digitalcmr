import {
  Body,
  Get,
  JsonController,
  Post,
  Req,
  UseAfter,
  UseInterceptor,
  Param, UseBefore
} from 'routing-controllers';
import {ErrorHandlerMiddleware, ComposerInterceptor, UserAuthenticatorMiddleware} from '../../middleware';
import {JSONWebToken} from '../../utils/authentication/JSONWebToken';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Identity} from '../../domain/Identity';
import {Config} from '../../config/index';
import {VehicleTransactor} from '../../domain/vehicles/VehicleTransactor';

@JsonController('/vehicle')
@UseBefore(UserAuthenticatorMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class ECMRController {
  public constructor(private transactionHandler: TransactionHandler) {
  }

  @Get('/')
  public async getAllVehicles(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getAllVehicles');
  }

  @Get('/vin/:vin/')
  public async getVehicleByVin(@Param('vin') vin: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getVehicleByVin', {vin: vin});
  }

  @Get('/plateNumber/:plateNumber/')
  public async getVehicleByPlateNumber(@Param('plateNumber') plateNumber: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getVehicleByPlateNumber', {plateNumber: plateNumber});
  }

  @Post('/')
  public async createVehicles(@Body() vehicles: any[], @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.create(identity, Config.settings.composer.profile, Config.settings.composer.namespace, vehicles, new VehicleTransactor());
  }
}