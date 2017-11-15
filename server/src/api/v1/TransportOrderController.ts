import {
  Get,
  JsonController,
  Req,
  UseAfter,
  UseInterceptor,
  Param,
  UseBefore, Post, Body, Put
} from 'routing-controllers';
import {ErrorHandlerMiddleware, ComposerInterceptor, UserAuthenticatorMiddleware} from '../../middleware';
import {JSONWebToken} from '../../utils/authentication/JSONWebToken';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Identity} from '../../domain/Identity';
import {Config} from '../../config/index';
import {Request} from 'express';
import {TransportOrderTransactor} from '../../domain/transportOrder/TransportOrderTransactor';
import {TransportOrder} from '../../../resources/interfaces/transportOrder.interface';
import {EcmrTransactor} from '../../domain/ecmrs/EcmrTransactor';
import {Ecmr} from '../../../resources/interfaces/ecmr.interface';
import {CreateEcmrFromTransportOrder} from '../../utils/transportOrder/CreateEcmrFromTransportOrder';
import {BusinessNetworkHandler} from '../../blockchain/BusinessNetworkHandler';

@JsonController('/transportOrder')
@UseBefore(UserAuthenticatorMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class TransportOrderController {
  public constructor(private transactionHandler: TransactionHandler,
                     private _createEcmrFromTransportOrder: CreateEcmrFromTransportOrder,
                     private transportOrderTransactor: TransportOrderTransactor,
                     private businessNetworkHandler: BusinessNetworkHandler) {
  }

  @Get('/')
  public async getAllTransportOrders(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getAllTransportOrders');
  }

  @Get('/orderID/:orderID')
  public async getTransportOrderByOrderID(@Param('orderID') orderID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getTransportOrderById', {orderID: orderID});
  }

  @Get('/status/:orderStatus')
  public async getAllTransportOrdersByStatus(@Param('orderStatus') orderStatus: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, 'getTransportOrdersByStatus', {status: orderStatus});
  }

  @Post('/')
  public async create(@Body() transportOrder: TransportOrder, @Req() request: Request): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();
    return await this.transactionHandler.create(identity, Config.settings.composer.profile, Config.settings.composer.namespace,
      transportOrder, new TransportOrderTransactor());
  }

  @Post('/createECMRFromTransportOrder')
  public async createEcmrFromTransportOrder(@Body() transportOrder: any, @Req() request: Request): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transportOrderTransactor.createECMRFromTransportOrder(identity, Config.settings.composer.profile, Config.settings.composer.namespace, this._createEcmrFromTransportOrder.ecmrFromTransportOrder(transportOrder), transportOrder, this.transactionHandler);
  }

  @Put('/')
  public async update(@Body() transportOrder: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.update(identity, Config.settings.composer.profile, Config.settings.composer.namespace, transportOrder, transportOrder.orderID, new TransportOrderTransactor());
  }
}
