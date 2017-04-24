import {Get, JsonController, Post, UseAfter, UseInterceptor} from 'routing-controllers';
import {Container} from 'typedi';
import {Net_biz_digitalPropertyNetwork_LandTitleApi, NetBizDigitalPropertyNetworkLandTitle} from '../../sdk/api';
import {ApiFactory} from '../../utils/ApiFactory';
import {ErrorHandlerMiddleware} from '../../middleware/ErrorHandlerMiddleware';

@JsonController('/landtitles')
@UseAfter(ErrorHandlerMiddleware)
export class LandTitleController {
  private api: Net_biz_digitalPropertyNetwork_LandTitleApi;

  public constructor() {
    const apiFactory = Container.get(ApiFactory);
    this.api = apiFactory.get(Net_biz_digitalPropertyNetwork_LandTitleApi);
  }

  @Get('/')
  @UseInterceptor((request: any, response: any, content: any): any => { // TODO move to own file
    return content.body;
  })
  public async getAll(): Promise<any> {
    return this.api.netBizDigitalPropertyNetworkLandTitleFind();
  }

  @Post('/')
  public async create(): Promise<any> {
    let title = new NetBizDigitalPropertyNetworkLandTitle();
    title.forSale = true;
    title.information = 'info';
    title.owner = 'me';
    title.titleId = 'test';

    return this.api.netBizDigitalPropertyNetworkLandTitleCreate(title);
  }
}