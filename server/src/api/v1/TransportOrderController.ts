import {
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Req,
  UseAfter,
  UseBefore,
  UseInterceptor
} from 'routing-controllers';
import {ComposerInterceptor, ErrorHandlerMiddleware, UserAuthenticatorMiddleware} from '../../middleware';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Config} from '../../config/index';
import {TransportOrderTransactor} from '../../domain/transportOrder/TransportOrderTransactor';
import {TransportOrder} from '../../interfaces/transportOrder.interface';
import {Transaction} from '../../blockchain/Transactions';
import {PickupWindow} from '../../interfaces/pickupWindow.interface';
import {DeliveryWindow} from '../../interfaces/deliveryWindow.interface';
import {Query} from '../../blockchain/Queries';
import {TransportOrderCancellation} from '../../interfaces/cancellation.interface';
import * as shortid from 'shortid';
import {ComposerConnectionMiddleware} from '../../middleware/ComposerConnectionMiddleware';
import {ErrorFactory} from '../../error/ErrorFactory';
import {ErrorType} from '../../error/ErrorType';

@JsonController('/transportOrder')
@UseBefore(UserAuthenticatorMiddleware, ComposerConnectionMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class TransportOrderController {
  public constructor(private transactionHandler: TransactionHandler,
                     private transportOrderTransactor: TransportOrderTransactor) {
  }

  @Get('/')
  public async getAllTransportOrders(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetAllTransportOrders).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/orderID/:orderID')
  public async getTransportOrderByOrderID(@Param('orderID') orderID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.findOne(request.identity, request.connection, Query.GetTransportOrderById, {orderID: orderID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.findOneError, error));
    });
  }

  @Get('/status/:orderStatus')
  public async getAllTransportOrdersByStatus(@Param('orderStatus') orderStatus: string,
                                             @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetTransportOrdersByStatus, {status: orderStatus}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/vin/:vin')
  public async getAllTransportOrdersByVin(@Param('vin') vin: string, @Req() request: any): Promise<any> {
    return await this.transportOrderTransactor.getAllTransportOrdersByVin(this.transactionHandler, request.identity, request.connection, vin).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Post('/')
  public async create(@Body() transportOrder: TransportOrder, @Req() request: any): Promise<any> {
    transportOrder.orderID = shortid.generate();

    const transaction: any = await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.CreateTransportOrder, transportOrder, new TransportOrderTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });

    return transaction.transportOrder;
  }

  @Put('/updatePickupWindow')
  public async updatePickupWindow(@Body() pickupWindowObject: PickupWindow, @Req() request: any): Promise<any> {
    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.UpdateTransportOrderPickupWindow, pickupWindowObject, new TransportOrderTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Put('/updateDeliveryWindow')
  public async updateDeliveryWindow(@Body() deliveryWindowObject: DeliveryWindow, @Req() request: any): Promise<any> {
    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.UpdateTransportOrderDeliveryWindow, deliveryWindowObject, new TransportOrderTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Put('/cancel')
  public async update(@Body() transportOrderCancellation: TransportOrderCancellation,
                      @Req() request: any): Promise<any> {
    transportOrderCancellation.cancellation.date = transportOrderCancellation.cancellation.date || new Date().getTime();

    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.UpdateTransportOrderStatusToCancelled, transportOrderCancellation, new TransportOrderTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }
}
