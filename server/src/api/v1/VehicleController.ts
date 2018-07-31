import {
  Body,
  Get,
  JsonController,
  Post,
  Req,
  UseAfter,
  UseInterceptor,
  Param, UseBefore
} from 'routing-controllers';
import {ErrorHandlerMiddleware, ComposerInterceptor, UserAuthenticatorMiddleware} from '../../middleware';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Config} from '../../config/index';
import {VehicleTransactor} from '../../domain/vehicles/VehicleTransactor';
import {Transaction} from '../../blockchain/Transactions';
import {Vehicle} from '../../interfaces/vehicle.interface';
import {Query} from '../../blockchain/Queries';
import {ComposerConnectionMiddleware} from '../../middleware/ComposerConnectionMiddleware';
import {ErrorFactory} from '../../error/ErrorFactory';
import {ErrorType} from '../../error/ErrorType';

@JsonController('/vehicle')
@UseBefore(UserAuthenticatorMiddleware, ComposerConnectionMiddleware)
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class ECMRController {
  public constructor(private transactionHandler: TransactionHandler) {
  }

  @Get('/')
  public async getAllVehicles(@Req() request: any): Promise<any> {
    return await this.transactionHandler.query(request.identity, request.connection, Query.GetAllVehicles).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.queryError, error));
    });
  }

  @Get('/vin/:vin/')
  public async getVehicleByVin(@Param('vin') vin: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.findOne(request.identity, request.connection, Query.GetVehicleByVin, {vin: vin}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.findOneError, error));
    });
  }

  @Get('/plateNumber/:plateNumber/')
  public async getVehicleByPlateNumber(@Param('plateNumber') plateNumber: string, @Req() request: any): Promise<any> {
    return await this.transactionHandler.findOne(request.identity, request.connection, Query.GetVehicleByPlateNumber,
      {plateNumber: plateNumber}).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.findOneError, error));
    });
  }

  @Post('/')
  public async create(@Body() vehicle: Vehicle, @Req() request: any): Promise<any> {
    return await this.transactionHandler.invoke(request.identity, request.connection, Config.settings.composer.namespace, Transaction.CreateVehicles, vehicle, new VehicleTransactor()).catch((error) => {
      throw(ErrorFactory.translate(ErrorType.invokeError, error));
    });
  }
}
