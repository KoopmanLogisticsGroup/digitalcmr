import {Component, OnInit} from '@angular/core';
import {EcmrService} from '../../services/ecmr.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  public currentView = 'OPEN';

  private ecmrs: any;
  private ecmrsFiltered: any;

  public constructor(private ecmrService: EcmrService) {
    ;
  }

  public ngOnInit() {
    this.ecmrService.getAllEcmrs('').subscribe(ecmrs => {
      console.log(ecmrs);
      this.ecmrs = ecmrs instanceof Array ? ecmrs : new Array(ecmrs);
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => ecmr.status.toUpperCase() === 'OPEN');
    });

  }

  public setCurrentView(view: string) {
    this.currentView = view;

    this.ecmrsFiltered = this.ecmrs.filter(ecmr => ecmr.status.toUpperCase() === view.toUpperCase());
  }


}
