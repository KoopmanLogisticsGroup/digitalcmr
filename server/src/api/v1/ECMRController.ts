import {
  Body,
  Get,
  JsonController,
  Post,
  Req,
  UseAfter,
  UseInterceptor,
  Param,
  Put
} from 'routing-controllers';
import {Container} from 'typedi';
import {ApiFactory} from '../../utils';
import {ECMR, ECMRApi, QueryApi} from '../../sdk/api';
import {ErrorHandlerMiddleware, ComposerInterceptor} from '../../middleware';
import {JSONWebToken} from '../../utils/authentication/JSONWebToken';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Identity} from '../../domain/Identity';
import {Config} from '../../config/index';
import {EcmrTransactor} from '../../domain/ecmrs/EcmrTransactor';
import {BusinessNetworkHandler} from '../../blockchain/BusinessNetworkHandler';

@JsonController('/ECMR')
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class ECMRController {
  private queryApi: QueryApi;
  private api: ECMRApi;

  public constructor(private transactionHandler: TransactionHandler,
                     private ecmrTransactor: EcmrTransactor) {
    const apiFactory = Container.get(ApiFactory);
    this.queryApi    = apiFactory.get(QueryApi);
    this.api         = apiFactory.get(ECMRApi);
  }

  @Get('/')
  public async getAllEcmrs(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getAllEcmrs');
  }

  @Get('/ecmrID/:ecmrID')
  public async getEcmrByEcmrID(@Param('ecmrID') ecmrID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getEcmrById', {id: ecmrID});
  }

  @Get('/status/:ecmrStatus')
  public async getAllEcmrsByStatus(@Param('ecmrStatus') ecmrStatus: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getEcmrsByStatus', {status: ecmrStatus});
  }

  @Get('/vehicle/vin/:vin')
  public async getAllEcmrsFromVehicleByVin(@Param('vin') vin: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return this.ecmrTransactor.getEcmrsByVin(identity, Config.settings.composer.profile, vin);
  }

  @Get('/vehicle/plateNumber/:plateNumber')
  public async getAllEcmrsFromVehicleByPlateNumber(@Param('plateNumber') plateNumber: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return this.ecmrTransactor.getEcmrsByPlateNumber(identity, Config.settings.composer.profile, plateNumber);
  }

  @Post('/')
  public async create(@Body() ecmr: ECMR, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return this.transactionHandler.create(identity, Config.settings.composer.profile, Config.settings.composer.namespace, ecmr, new EcmrTransactor(Container.get(BusinessNetworkHandler)));
  }

  @Put('/')
  public async update(@Body() ecmr: ECMR, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();
    const ip                 = request.ip;

    return this.transactionHandler.update(identity, Config.settings.composer.profile, Config.settings.composer.namespace, ecmr, ecmr.ecmrID, new EcmrTransactor(Container.get(BusinessNetworkHandler)));
  }
}