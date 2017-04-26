import {Body, Get, JsonController, Post, UseAfter, UseInterceptor} from 'routing-controllers';
import {Container} from 'typedi';
import {Net_biz_digitalPropertyNetwork_LandTitleApi, NetBizDigitalPropertyNetworkLandTitle} from '../../sdk/api';
import {ApiFactory} from '../../utils';
import {ErrorHandlerMiddleware, ComposerInterceptor} from '../../middleware'; // TODO global

@JsonController('/landtitles')
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class LandTitleController {
  private api: Net_biz_digitalPropertyNetwork_LandTitleApi;

  public constructor() {
    const apiFactory = Container.get(ApiFactory);
    this.api = apiFactory.get(Net_biz_digitalPropertyNetwork_LandTitleApi);
  }

  @Get('/')
  public async getAll(): Promise<any> {
    return this.api.netBizDigitalPropertyNetworkLandTitleFind();
  }

  @Post('/')
  public async create(@Body() landTitle: NetBizDigitalPropertyNetworkLandTitle): Promise<any> {
    return this.api.netBizDigitalPropertyNetworkLandTitleCreate(landTitle);
  }
}