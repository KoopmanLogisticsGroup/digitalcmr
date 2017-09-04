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
import {ECMR, ECMRApi, QueryApi} from '../../sdk/api';
import {ErrorHandlerMiddleware, ComposerInterceptor, TransactionHandler} from '../../middleware';
import {JSONWebToken} from '../../utils/auth/JSONWebToken';

@JsonController('/vehicle')
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class ECMRController {
  private queryApi: QueryApi;
  private api: ECMRApi;

  public constructor(private _transactor: TransactionHandler) {
    const apiFactory   = Container.get(ApiFactory);
    this.queryApi      = apiFactory.get(QueryApi);
    this.api           = apiFactory.get(ECMRApi);
    this._transactor   = new TransactionHandler();
  }

  @Get('/')
  public async getAllVehicles(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const vehicles = await this._transactor.executeQuery('getAllVehicles', enrollmentID, secret);
    return vehicles;
  }

  @Get('/vin/:vin/')
  public async getVehicleByVin(@Param('vin') vin: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const vehicles = await this._transactor.executeQuery('getVehicleByVin', enrollmentID, secret, {vin: vin});

    return vehicles;
  }

  @Get('/plateNumber/:plateNumber/')
  public async getVehicleByPlateNumber(@Param('plateNumber') plateNumber: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const vehicles = await this._transactor.executeQuery('getVehicleByPlateNumber', enrollmentID, secret, {plateNumber: plateNumber});

    return vehicles;
  }

}