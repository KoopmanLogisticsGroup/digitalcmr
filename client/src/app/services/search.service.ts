import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SearchService {
  searchData$: Observable<any>;
  private searchDataSubject = new Subject<any>();

  filterEcmr$: Observable<any>;
  private filterEcmrSubject = new Subject<any>();

  constructor() {
    this.searchData$ = this.searchDataSubject.asObservable();
    this.filterEcmr$ = this.filterEcmrSubject.asObservable();
  }

  public searchData(data) {
    this.searchDataSubject.next(data);
  }

  public ecmrFilter(data) {
    this.filterEcmrSubject.next(data);
  }
}
