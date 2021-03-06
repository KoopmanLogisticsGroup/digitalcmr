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
import {EcmrTransactor} from '../../domain/ecmrs/EcmrTransactor';
import {Transaction} from '../../blockchain/Transactions';
import {Query} from '../../blockchain/Queries';
import {ExpectedWindow} from '../../interfaces/expectedWindow.interface';
import {UpdateEcmrStatus} from '../../interfaces/updateEcmrStatus.interface';
import {EcmrCancellation} from '../../interfaces/cancellation.interface';
import {Signature} from '../../interfaces/signature.interface';
import {CreateEcmrs} from '../../interfaces/createEcmrs.interface';
import {EcmrStatus} from '../../interfaces/ecmr.interface';
import * as shortid from 'shortid';
import {ComposerConnectionMiddleware} from '../../middleware/ComposerConnectionMiddleware';
import {ErrorFactory} from '../../error/ErrorFactory';
import {ErrorType} from '../../error/ErrorType';

@JsonController('/ECMR')
@UseBefore(UserAuthenticatorMiddleware, ComposerConnectionMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class ECMRController {
  public constructor(private transactionHandler: TransactionHandler,
                     private ecmrTransactor: EcmrTransactor) {
  }

  @Get('/')
  public async getAllEcmrs(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetAllEcmrs).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/ecmrID/:ecmrID')
  public async getEcmrByEcmrID(@Param('ecmrID') ecmrID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.findOne(request.identity, request.connection, Query.GetEcmrById, {ecmrID: ecmrID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.findOneError, error));
    });
  }

  @Get('/status/:ecmrStatus')
  public async getAllEcmrsByStatus(@Param('ecmrStatus') ecmrStatus: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetEcmrsByStatus, {status: ecmrStatus}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/orderID/:orderID')
  public async getAllEcmrsByOrderID(@Param('orderID') orderID: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetEcmrsByOrderID, {orderID: orderID}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/vehicle/vin/:vin')
  public async getAllEcmrsFromVehicleByVin(@Param('vin') vin: string, @Req() request: any): Promise<any> {
    return await this.ecmrTransactor.getEcmrsByVin(this.transactionHandler, request.connection, request.identity, vin).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/vehicle/plateNumber/:plateNumber')
  public async getAllEcmrsFromVehicleByPlateNumber(@Param('plateNumber') plateNumber: string,
                                                   @Req() request: any): Promise<any> {
    return await this.ecmrTransactor.getEcmrsByPlateNumber(this.transactionHandler, request.connection, request.identity, plateNumber).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Post('/')
  public async create(@Body() data: CreateEcmrs, @Req() request: any): Promise<any> {
    for (const ecmr of data.ecmrs) {
      ecmr.ecmrID = shortid.generate();
    }

    const transaction: any = await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.CreateEcmrs, data, new EcmrTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });

    return transaction.ecmrs;
  }

  @Put('/status/' + EcmrStatus.Loaded)
  public async updateEcmrStatusToLoaded(@Body() data: UpdateEcmrStatus, @Req() request: any): Promise<any> {
    data.signature = <Signature> {
      timestamp:     data.signature.timestamp || new Date().getTime(),
      ip:            data.signature.ip || '0.0.0.0',
      latitude:      data.signature.latitude || 0,
      longitude:     data.signature.longitude || 0,
      generalRemark: data.signature && data.signature.generalRemark
    };

    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.UpdateEcmrStatusToLoaded, data, new EcmrTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Put('/status/' + EcmrStatus.InTransit)
  public async updateEcmrStatusToInTransit(@Body() data: UpdateEcmrStatus, @Req() request: any): Promise<any> {
    data.signature = <Signature> {
      timestamp:     data.signature.timestamp || new Date().getTime(),
      ip:            data.signature.ip || '0.0.0.0',
      latitude:      data.signature.latitude || 0,
      longitude:     data.signature.longitude || 0,
      generalRemark: data.signature && data.signature.generalRemark
    };

    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.UpdateEcmrStatusToInTransit, data, new EcmrTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Put('/status/' + EcmrStatus.Delivered)
  public async updateEcmrStatusToDelivered(@Body() data: UpdateEcmrStatus, @Req() request: any): Promise<any> {
    data.signature = <Signature> {
      timestamp:     data.signature.timestamp || new Date().getTime(),
      ip:            data.signature.ip || '0.0.0.0',
      latitude:      data.signature.latitude || 0,
      longitude:     data.signature.longitude || 0,
      generalRemark: data.signature && data.signature.generalRemark
    };

    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.UpdateEcmrStatusToDelivered, data, new EcmrTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Put('/status/' + EcmrStatus.ConfirmedDelivered)
  public async updateEcmrStatusToConfirmedDelivered(@Body() data: UpdateEcmrStatus, @Req() request: any): Promise<any> {
    data.signature = <Signature> {
      timestamp:     data.signature.timestamp || new Date().getTime(),
      ip:            data.signature.ip || '0.0.0.0',
      latitude:      data.signature.latitude || 0,
      longitude:     data.signature.longitude || 0,
      generalRemark: data.signature && data.signature.generalRemark
    };

    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.UpdateEcmrStatusToConfirmedDelivered, data, new EcmrTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Put('/cancel')
  public async updateECMRtoCancelled(@Body() ecmrCancellation: EcmrCancellation, @Req() request: any): Promise<any> {
    ecmrCancellation.cancellation.date = ecmrCancellation.cancellation.date || new Date().getTime();

    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.UpdateEcmrStatusToCancelled, ecmrCancellation, new EcmrTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Put('/updateExpectedPickupWindow')
  public async updateExpectedPickupWindow(@Body() etaObject: ExpectedWindow, @Req() request: any): Promise<any> {
    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.UpdateExpectedPickupWindow, etaObject, new EcmrTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }

  @Put('/updateExpectedDeliveryWindow')
  public async updateExpectedDeliveryWindow(@Body() etaObject: ExpectedWindow, @Req() request: any): Promise<any> {
    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.UpdateExpectedDeliveryWindow, etaObject, new EcmrTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }
}
