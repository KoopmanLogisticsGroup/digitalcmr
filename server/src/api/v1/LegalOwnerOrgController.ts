import {Body, Get, JsonController, Post, Delete, UseAfter, UseInterceptor, Param} from 'routing-controllers';
import {Container} from 'typedi';
import {ApiFactory} from '../../utils';
import {LegalOwnerOrg, LegalOwnerOrgApi} from '../../sdk/api';
import {ErrorHandlerMiddleware, ComposerInterceptor} from '../../middleware';

@JsonController('/leaseplanassets')
@UseInterceptor(ComposerInterceptor)
@UseAfter(ErrorHandlerMiddleware)
export class LegalOwnerController {
  private api: LegalOwnerOrgApi;

  public constructor() {
    const apiFactory = Container.get(ApiFactory);
    this.api         = apiFactory.get(LegalOwnerOrgApi);
  }

  @Get('/')
  public async getAll(): Promise<any> {
    return this.api.legalOwnerOrgFind();
  }

  @Post('/')
  public async create(@Body() legalownerAsset: LegalOwnerOrg): Promise<any> {
    return this.api.legalOwnerOrgCreate(legalownerAsset);
  }

  @Delete('/:leasePlanId')
  public async deleteAll(@Param('leasePlanId') legalOwnerId: string): Promise<any> {
    console.log('test');
    let checkId = await this.api.legalOwnerOrgDeleteById(legalOwnerId);
    console.log('Error --> : ' + checkId);
    return 'Deleted';
  }
}