import {Body, Get, JsonController, Post, Req, UseAfter, UseInterceptor, Param, UseBefore, Put} from 'routing-controllers';
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
  public async getAll(@Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = request.headers.secret;
    return this._transactor.getAllECMRs(enrollmentID, secret, () => this.queryApi.queryGetAllEcmrs());
  }

  @Post('/')
  public async create(@Body() ecmr: ECMR, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = request.headers.secret;
    return this._transactor.put(ecmr, enrollmentID, secret, (factory, data) => this._transactor.createECMR(factory, data));
  }

  @Put('/')
  public async update(@Body() ecmr: any, @Req() request: any): Promise<any> {
    let enrollmentID = new JSONWebToken(request).getUserID();
    let secret       = request.headers.secret;
    return this._transactor.put(ecmr, enrollmentID, secret, (factory, data) => this._transactor.updateECMR(factory, data));
  }
}