import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
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
        if (x[k].toString().toLocaleLowerCase().indexOf(query) !== -1) {
          console.log('info: ' + x[k]);
          filtered.add(x);
        }
      });
    });
    return Array.from(filtered);
  }
}
