import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
  public constructor() {
  }

  public transform(data: any[], query: string): any[] {
    if (!(data && data.length && (typeof query === 'string')) || query === '') {
      return data;
    }
    query                  = query.toLocaleLowerCase();
    const objectProperties = Object.keys(data[0]);
    const filtered         = new Set;
    data.forEach(object => {
      object.goods.filter(good => {
        if (good.vehicle.vin.toString().toLocaleLowerCase().indexOf(query) !== -1) {
          filtered.add(object);
        } else if (good.vehicle.plateNumber.toString().toLocaleLowerCase().indexOf(query) !== -1) {
          filtered.add(object);
        }
      });
      objectProperties.forEach(objectProperty => {
        if (object[objectProperty] !== undefined && object[objectProperty].toString().toLocaleLowerCase().indexOf(query) !== -1) {
          filtered.add(object);
        }
      });
    });
    return Array.from(filtered);
  }
}
