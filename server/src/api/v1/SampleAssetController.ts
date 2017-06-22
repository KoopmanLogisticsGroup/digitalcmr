import {Body, Get, JsonController, Post, UseAfter, UseInterceptor} from 'routing-controllers';
import {Container} from 'typedi';
import {ApiFactory} from '../../utils';
import {SampleAsset, SampleAssetApi} from '../../sdk/api';
import {ErrorHandlerMiddleware, ComposerInterceptor} from '../../middleware';

@JsonController('/sampleassets')
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class SampleAssetController {
  private api: SampleAssetApi;

  public constructor() {
    const apiFactory = Container.get(ApiFactory);
    this.api = apiFactory.get(SampleAssetApi);
  }

  @Get('/')
  public async getAll(): Promise<any> {
    return this.api.sampleAssetFind();
  }

  @Post('/')
  public async create(@Body() sampleAsset: SampleAsset): Promise<any> {
    return this.api.sampleAssetCreate(sampleAsset);
  }
}