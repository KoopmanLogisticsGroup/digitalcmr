import {
  Body,
  JsonController,
  Post,
  Req,
  UseAfter,
  UseInterceptor,
  UseBefore
} from 'routing-controllers';

import {ErrorHandlerMiddleware, ComposerInterceptor, UserAuthenticatorMiddleware} from '../../middleware';
import {JSONWebToken} from '../../utils/authentication/JSONWebToken';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Identity} from '../../domain/Identity';
import {Config} from '../../config/index';
import {Request} from 'express';
import {TransportOrderTransactor} from '../../domain/transportOrder/TransportOrderTransactor';
import {TransportOrder} from '../../../resources/interfaces/transportOrder.interface';

@JsonController('/transportOrder')
@UseBefore(UserAuthenticatorMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class TransportOrderController {
  public constructor(private transactionHandler: TransactionHandler) {
  }

  @Post('/')
  public async create(@Body() transportOrder: TransportOrder, @Req() request: Request): Promise<any> {
    const identity: Identity = new JSONWebToken(request).getIdentity();
    return await this.transactionHandler.create(identity, Config.settings.composer.profile, Config.settings.composer.namespace, transportOrder, new TransportOrderTransactor());
  }
}