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
import {QueryReturnType, TransactionHandler} from '../../blockchain/TransactionHandler';
import {Config} from '../../config/index';
import {VehicleTransactor} from '../../domain/vehicles/VehicleTransactor';
import {Transaction} from '../../blockchain/Transactions';
import {Vehicle} from '../../interfaces/vehicle.interface';
import {Query} from '../../blockchain/Queries';
import {Identity} from '../../interfaces/entity.inferface';

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

    return await this.transactionHandler.query(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllVehicles);
  }

  @Get('/vin/:vin/')
  public async getVehicleByVin(@Param('vin') vin: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.query(identity, Config.settings.composer.profile, QueryReturnType.Single, Query.GetVehicleByVin, {vin: vin});
  }

  @Get('/plateNumber/:plateNumber/')
  public async getVehicleByPlateNumber(@Param('plateNumber') plateNumber: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.query(identity, Config.settings.composer.profile, QueryReturnType.Single, Query.GetVehicleByPlateNumber,
      {plateNumber: plateNumber});
  }

  @Post('/')
  public async create(@Body() vehicle: Vehicle, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.CreateVehicles, vehicle, new VehicleTransactor());
  }
}
