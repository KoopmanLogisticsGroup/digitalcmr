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
import {UpdateEcmrStatus} from '../../interfaces/updateEcmrStatus.interface';
import {EcmrCancellation} from '../../interfaces/cancellation.interface';
import {Signature} from '../../interfaces/signature.interface';
import {CreateEcmrs} from '../../interfaces/createEcmrs.interface';

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
  public async create(@Body() data: CreateEcmrs, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.CreateEcmrs, data, new EcmrTransactor());
  }

  @Put('/status/LOADED')
  public async updateEcmrStatusToLoaded(@Body() data: UpdateEcmrStatus, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    data.signature = <Signature> {
      timestamp:     new Date().getTime(),
      ip:            request.ip.toString(),
      latitude:      Math.random() < 0.5 ? ((1 - Math.random()) * (90 - (-90)) + -90) : (Math.random() * (90 - (-90)) + (-90)),
      longitude:     Math.random() < 0.5 ? ((1 - Math.random()) * (180 - (-180)) + -180) : (Math.random() * (180 - (-180)) + (-180)),
      generalRemark: data.signature && data.signature.generalRemark
    };

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateEcmrStatusToLoaded, data, new EcmrTransactor());
  }

  @Put('/status/IN_TRANSIT')
  public async updateEcmrStatusToInTransit(@Body() data: UpdateEcmrStatus, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    data.signature = <Signature> {
      timestamp:     new Date().getTime(),
      ip:            request.ip.toString(),
      latitude:      Math.random() < 0.5 ? ((1 - Math.random()) * (90 - (-90)) + -90) : (Math.random() * (90 - (-90)) + (-90)),
      longitude:     Math.random() < 0.5 ? ((1 - Math.random()) * (180 - (-180)) + -180) : (Math.random() * (180 - (-180)) + (-180)),
      generalRemark: data.signature && data.signature.generalRemark
    };

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateEcmrStatusToInTransit, data, new EcmrTransactor());
  }

  @Put('/status/DELIVERED')
  public async updateEcmrStatusToDelivered(@Body() data: UpdateEcmrStatus, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    data.signature = <Signature> {
      timestamp:     new Date().getTime(),
      ip:            request.ip.toString(),
      latitude:      Math.random() < 0.5 ? ((1 - Math.random()) * (90 - (-90)) + -90) : (Math.random() * (90 - (-90)) + (-90)),
      longitude:     Math.random() < 0.5 ? ((1 - Math.random()) * (180 - (-180)) + -180) : (Math.random() * (180 - (-180)) + (-180)),
      generalRemark: data.signature && data.signature.generalRemark
    };

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateEcmrStatusToDelivered, data, new EcmrTransactor());
  }

  @Put('/status/CONFIRMED_DELIVERED')
  public async updateEcmrStatusToConfirmedDelivered(@Body() data: UpdateEcmrStatus, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    data.signature = <Signature> {
      timestamp:     new Date().getTime(),
      ip:            request.ip.toString(),
      latitude:      Math.random() < 0.5 ? ((1 - Math.random()) * (90 - (-90)) + -90) : (Math.random() * (90 - (-90)) + (-90)),
      longitude:     Math.random() < 0.5 ? ((1 - Math.random()) * (180 - (-180)) + -180) : (Math.random() * (180 - (-180)) + (-180)),
      generalRemark: data.signature && data.signature.generalRemark
    };

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateEcmrStatusToConfirmedDelivered, data, new EcmrTransactor());
  }

  @Put('/cancel')
  public async updateECMRtoCancelled(@Body() ecmrCancellation: EcmrCancellation, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    ecmrCancellation.cancellation.date = new Date().getTime();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateEcmrStatusToCancelled, ecmrCancellation, new EcmrTransactor());
  }

  @Put('/updateExpectedPickupWindow')
  public async updateExpectedPickupWindow(@Body() etaObject: ExpectedWindow, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateExpectedPickupWindow, etaObject, new EcmrTransactor());
  }

  @Put('/updateExpectedDeliveryWindow')
  public async updateExpectedDeliveryWindow(@Body() etaObject: ExpectedWindow, @Req() request: any): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();

    return await this.transactionHandler.invoke(identity, Config.settings.composer.profile, Config.settings.composer.namespace, Transaction.UpdateExpectedDeliveryWindow, etaObject, new EcmrTransactor());
  }
}
