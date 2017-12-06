import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SearchService {
  searchData$: Observable<any>;
  private searchDataSubject: Subject<any>;

  private callHeaderComponentToClearSearchBar = new Subject<any>();
          componentCalled$                    = this.callHeaderComponentToClearSearchBar.asObservable();

  constructor() {
    this.searchDataSubject = new Subject();
    this.searchData$       = this.searchDataSubject.asObservable();
  }

  public searchData(data: Observable<any>): void {
    this.searchDataSubject.next(data);
  }

  public clearSearchBar(): void {
    this.callHeaderComponentToClearSearchBar.next();
  }
}
