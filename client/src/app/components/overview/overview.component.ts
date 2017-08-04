import {Component, OnInit} from '@angular/core';
import {EcmrService} from '../../services/ecmr.service';

@Component({
  selector:    'app-overview',
  templateUrl: './overview.component.html',
  styleUrls:   ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  public ecmrList: any[];
  public ecmrFilteredList: any[];
  public currentView = 'open';

  public constructor(private ecmrService: EcmrService) {
    ;
  }

  public ngOnInit() {
    this.ecmrList = this.ecmrService.getEcmrByUser();
    this.filterEcmrList(this.currentView);
    // this.ecmrService.getEcmrByUser().subscribe((ecmrs: any[]) => {
    //   this.ecmrList = ecmrs
    // });
  }

  public setCurrentView(view: string) {
    this.currentView = view;
    this.filterEcmrList(view);
  }

  private filterEcmrList(view: string): void {
    this.currentView = view;
    this.ecmrFilteredList = this.ecmrList.filter(x => x.status.toLowerCase() === view.toLocaleLowerCase());
  }

}
