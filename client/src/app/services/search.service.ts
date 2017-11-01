import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SearchService {
  searchData$: Observable<any>;
  private searchDataSubject: Subject<any>;

  filterEcmr$: Observable<any>;
  private filterEcmrSubject: Subject<any>;

  constructor() {
    this.searchDataSubject = new Subject();
    this.filterEcmrSubject = new Subject();
    this.searchData$ = this.searchDataSubject.asObservable();
    this.filterEcmr$ = this.filterEcmrSubject.asObservable();
  }

  public searchData(data: Observable<any>): void {
    this.searchDataSubject.next(data);
  }
}
