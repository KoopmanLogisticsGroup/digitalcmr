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

@JsonController('/ECMR')
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class ECMRController {
  private queryApi: QueryApi;
  private api: ECMRApi;
  private assetRegistry: string;

  public constructor(private _transactor: TransactionHandler) {
    const apiFactory   = Container.get(ApiFactory);
    this.queryApi      = apiFactory.get(QueryApi);
    this.api           = apiFactory.get(ECMRApi);
    this.assetRegistry = 'ECMR';
    this._transactor   = new TransactionHandler();
  }

  @Get('/')
  public async getAllEcmrs(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const ecmrs = await this._transactor.executeQuery('getAllEcmrs', enrollmentID, secret);
    return ecmrs;
  }

  @Get('/byid/:ecmrID')
  public async getEcmrByID(@Param('ecmrID') ecmrID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const ecmrs = await this._transactor.executeQuery('getEcmrById', enrollmentID, secret, {id: ecmrID});
    return ecmrs;
  }

  @Get('/bystatus/:ecmrStatus')
  public async getEcmrByStatus(@Param('ecmrStatus') ecmrStatus: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const ecmrs = await this._transactor.executeQuery('getEcmrsByStatus', enrollmentID, secret, {status: ecmrStatus});
    return ecmrs;
  }

  @Get('/byVin/:vin')
  public async getEcmrsByVin(@Param('vin') vin: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    const ecmrs = await this._transactor.getEcmrsByVin(enrollmentID, secret, vin);

    return ecmrs;
  }

  @Post('/')
  public async create(@Body() ecmr: ECMR, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();

    return this._transactor.put(ecmr, enrollmentID, secret, (factory, data) => this._transactor.createECMR(factory, data, enrollmentID));
  }

  @Put('/')
  public async update(@Body() ecmr: ECMR, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = new JSONWebToken(request).getSecret();
    const ip         = request.ip;
    return this._transactor.put(ecmr, enrollmentID, secret, (factory, data) => this._transactor.updateECMR(factory, data, enrollmentID, ip));
  }
}