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
    const apiFactory = Container.get(ApiFactory);
    this.queryApi = apiFactory.get(QueryApi);
    this.api = apiFactory.get(ECMRApi);
    this.assetRegistry = 'ECMR';
    this._transactor = new TransactionHandler();
  }

  @Get('/:ecmrID')
  public async get(@Param('ecmrID') ecmrID: string, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret = new JSONWebToken(request).getSecret();

    return this._transactor.get(ecmrID, this.assetRegistry, enrollmentID, secret);
  }

  @Get('/')
  public async getAll(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret = new JSONWebToken(request).getSecret();

    return this._transactor.getAllECMRs(enrollmentID, secret, () => this.queryApi.queryGetAllEcmrs());
  }

  @Post('/')
  public async create(@Body() ecmr: ECMR, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret = new JSONWebToken(request).getSecret();

    return this._transactor.put(ecmr, enrollmentID, secret, (factory, data) => this._transactor.createECMR(factory, data, enrollmentID));
  }

  @Put('/')
  public async update(@Body() ecmr: ECMR, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret = new JSONWebToken(request).getSecret();
    const ip = request.ip;
    return this._transactor.put(ecmr, enrollmentID, secret, (factory, data) => this._transactor.updateECMR(factory, data, enrollmentID, ip));
  }
}