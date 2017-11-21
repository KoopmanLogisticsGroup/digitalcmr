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
import {Identity} from '../../domain/Identity';
import {Config} from '../../config/index';
import {Request} from 'express';
import {TransportOrderTransactor} from '../../domain/transportOrder/TransportOrderTransactor';
import {TransportOrder} from '../../interfaces/transportOrder.interface';
import {Transaction} from '../../blockchain/Transactions';

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

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, 'getAllTransportOrders');
  }

  @Get('/orderID/:orderID')
  public async getTransportOrderByOrderID(@Param('orderID') orderID: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Single, 'getTransportOrderById', {orderID: orderID});
  }

  @Get('/status/:orderStatus')
  public async getAllTransportOrdersByStatus(@Param('orderStatus') orderStatus: string, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.executeQuery(identity, Config.settings.composer.profile, QueryReturnType.Multiple, 'getTransportOrdersByStatus', {status: orderStatus});
  }

  @Post('/')
  public async create(@Body() transportOrder: TransportOrder, @Req() request: Request): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();
    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.CreateTransportOrder, transportOrder, new TransportOrderTransactor());
  }

  @Put('/orderID/:orderID/vin/:vin')
  public async updatePickupWindow(@Param('orderID') orderID: string, @Param('vin') vin: string, @Body() pickupWindow: any, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();
    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, orderID, vin, pickupWindow);
  }
}
