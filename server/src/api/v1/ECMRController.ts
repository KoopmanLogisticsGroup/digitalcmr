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
import {QueryReturnType, TransactionHandler} from '../../blockchain/TransactionHandler';
import {Identity} from '../../domain/Identity';
import {Config} from '../../config/index';
import {EcmrTransactor} from '../../domain/ecmrs/EcmrTransactor';
import {Transaction} from '../../blockchain/Transactions';
import {Ecmr} from '../../interfaces/ecmr.interface';
import {Query} from '../../blockchain/Queries';
import {ExpectedWindow} from '../../interfaces/expectedWindow.interface';

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

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllEcmrs);
  }

  @Get('/ecmrID/:ecmrID')
  public async getEcmrByEcmrID(@Param('ecmrID') ecmrID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, Query.GetEcmrById, {ecmrID: ecmrID});
  }

  @Get('/status/:ecmrStatus')
  public async getAllEcmrsByStatus(@Param('ecmrStatus') ecmrStatus: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetEcmrsByStatus, {status: ecmrStatus});
  }

  @Get('/orderID/:orderID')
  public async getAllEcmrsByOrderID(@Param('orderID') orderID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetEcmrsByOrderID, {orderID: orderID});
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
  public async create(@Body() data: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.CreateEcmrs, data, new EcmrTransactor());
  }

  @Put('/')
  public async update(@Body() ecmr: Ecmr, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();
    const ip                 = request.ip;

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateEcmr, ecmr, new EcmrTransactor());
  }

  @Put('/updateExpectedDeliveryWindow')
  public async updateExpectedDeliveryWindow(@Body() etaObject: ExpectedWindow, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateExpectedDeliveryWindow, etaObject, new EcmrTransactor());
  }
}
