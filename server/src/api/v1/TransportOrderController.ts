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
import {QueryReturnType, TransactionHandler} from '../../blockchain/TransactionHandler';
import {Config} from '../../config/index';
import {Request} from 'express';
import {TransportOrderTransactor} from '../../domain/transportOrder/TransportOrderTransactor';
import {TransportOrder} from '../../interfaces/transportOrder.interface';
import {Transaction} from '../../blockchain/Transactions';
import {PickupWindow} from '../../interfaces/pickupWindow.interface';
import {DeliveryWindow} from '../../interfaces/deliveryWindow.interface';
import {Query} from '../../blockchain/Queries';
import {TransportOrderCancellation} from '../../interfaces/cancellation.interface';
import * as shortid from 'shortid';
import {Identity} from '../../interfaces/entity.inferface';

@JsonController('/transportOrder')
@UseBefore(UserAuthenticatorMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class TransportOrderController {
  public constructor(private transactionHandler: TransactionHandler,
                     private transportOrderTransactor: TransportOrderTransactor) {
  }

  @Get('/')
  public async getAllTransportOrders(@Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.query(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetAllTransportOrders);
  }

  @Get('/orderID/:orderID')
  public async getTransportOrderByOrderID(@Param('orderID') orderID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.query(identity, Config.settings.composer.profile, QueryReturnType.Single, Query.GetTransportOrderById, {orderID: orderID});
  }

  @Get('/status/:orderStatus')
  public async getAllTransportOrdersByStatus(@Param('orderStatus') orderStatus: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.query(identity, Config.settings.composer.profile, QueryReturnType.Multiple, Query.GetTransportOrdersByStatus, {status: orderStatus});
  }

  @Get('/vin/:vin')
  public async getAllTransportOrdersByVin(@Param('vin') vin: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transportOrderTransactor.getAllTransportOrdersByVin(this.transactionHandler, identity, Config.settings.composer.profile, vin);
  }

  @Post('/')
  public async create(@Body() transportOrder: TransportOrder, @Req() request: Request): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();
    transportOrder.orderID   = shortid.generate();

    const transaction: any = await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.CreateTransportOrder, transportOrder, new TransportOrderTransactor());

    return transaction.transportOrder;
  }

  @Put('/updatePickupWindow')
  public async updatePickupWindow(@Body() pickupWindowObject: PickupWindow, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateTransportOrderPickupWindow, pickupWindowObject, new TransportOrderTransactor());
  }

  @Put('/updateDeliveryWindow')
  public async updateDeliveryWindow(@Body() deliveryWindowObject: DeliveryWindow, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateTransportOrderDeliveryWindow, deliveryWindowObject, new TransportOrderTransactor());
  }

  @Put('/cancel')
  public async update(@Body() transportOrderCancellation: TransportOrderCancellation, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    transportOrderCancellation.cancellation.date = transportOrderCancellation.cancellation.date || new Date().getTime();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateTransportOrderStatusToCancelled, transportOrderCancellation, new TransportOrderTransactor());
  }
}
