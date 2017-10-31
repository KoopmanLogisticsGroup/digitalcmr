import {Pipe, PipeTransform} from '@angular/core';
import {SearchService} from '../services/search.service';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
  public constructor() {
  }

  public transform(ecmrs: any[], query: string): any[] {
    if (!(ecmrs && ecmrs.length && (typeof query === 'string')) || query === '') {
      return ecmrs;
    }
    query = query.toLocaleLowerCase();
    const ecmrProperties     = Object.keys(ecmrs[0]);
    const filtered = new Set;
    ecmrs.forEach(emcr => {
      emcr.goods.filter(good => {
        if (good.vehicle.vin.toString().toLocaleLowerCase().indexOf(query) !== -1) {
          filtered.add(emcr);
        } else if (good.vehicle.plateNumber.toString().toLocaleLowerCase().indexOf(query) !== -1) {
          filtered.add(emcr);
        }
      });
      ecmrProperties.forEach(ecmrProperty => {
        if (emcr[ecmrProperty] !== undefined && emcr[ecmrProperty].toString().toLocaleLowerCase().indexOf(query) !== -1) {
          filtered.add(emcr);
        }
      });
    });

    return Array.from(filtered);
  }
}
