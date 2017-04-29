import {Body, Get, JsonController, Post, UseAfter, UseInterceptor} from 'routing-controllers';
import {Container} from 'typedi';
import {ApiFactory} from '../../utils';
import {LandTitleApi, LandTitle} from '../../sdk/api';
import {ErrorHandlerMiddleware, ComposerInterceptor} from '../../middleware';

@JsonController('/landtitles')
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class LandTitleController {
  private api: LandTitleApi;

  public constructor() {
    const apiFactory = Container.get(ApiFactory);
    this.api = apiFactory.get(LandTitleApi);
  }

  @Get('/')
  public async getAll(): Promise<any> {
    return this.api.landTitleFind();
  }

  @Post('/')
  public async create(@Body() landTitle: LandTitle): Promise<any> {
    return this.api.landTitleCreate(landTitle);
  }
}