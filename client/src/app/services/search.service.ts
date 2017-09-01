import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SearchService {
  searchData$: Observable<any>;
  private searchDataSubject = new Subject<any>();

  constructor() {
    this.searchData$ = this.searchDataSubject.asObservable();
  }

  searchData(data) {
    this.searchDataSubject.next(data);
  }

}
