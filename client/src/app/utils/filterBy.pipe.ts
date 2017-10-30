import {Pipe, PipeTransform} from '@angular/core';
import {SearchService} from '../services/search.service';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
  public constructor() {
  }

  public transform(arrayOfEcmrs: any[], query: string): any[] {
    if (!(arrayOfEcmrs && arrayOfEcmrs.length && (typeof query === 'string')) || query === '') {
      return arrayOfEcmrs;
    }
    query = query.toLocaleLowerCase();
    const ecmrProperties     = Object.keys(arrayOfEcmrs[0]);
    const filtered = new Set;
    arrayOfEcmrs.forEach(emcr => {
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
