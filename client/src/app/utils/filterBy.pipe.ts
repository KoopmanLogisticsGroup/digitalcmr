import {Pipe, PipeTransform} from '@angular/core';
import {SearchService} from '../services/search.service';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

  public resultFilter: any;

  public constructor(private searchService: SearchService) {
  }

  public transform(array: any[], query: string): any[] {
    if (!(array && array.length && (typeof query === 'string')) || query === '') {
      return array;
    }
    query          = query.toLocaleLowerCase();
    const keys     = Object.keys(array[0]);
    const filtered = new Set;
    array.forEach(x => {
      x.goods.filter(y => {
        if (y.vehicle.vin.toString().toLocaleLowerCase().indexOf(query) !== -1) {
          filtered.add(x);
        } else if (y.vehicle.plateNumber.toString().toLocaleLowerCase().indexOf(query) !== -1) {
          filtered.add(x);
        }
      });
      keys.forEach(k => {
        if (x[k] !== undefined && x[k].toString().toLocaleLowerCase().indexOf(query) !== -1) {
          filtered.add(x);
        }
      });
    });
    this.resultFilter = Array.from(filtered);
    this.resultFilter = this.resultFilter.length;
    this.searchService.ecmrFilter(this.resultFilter);
    return Array.from(filtered);
  }
}
