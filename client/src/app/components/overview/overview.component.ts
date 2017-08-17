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
      this.ecmrs = ecmrs instanceof Array ? ecmrs : new Array(ecmrs);
      // TODO implement in backend
      const userOrg = JSON.parse(localStorage.getItem('currentUser')).user.org;
      const userEmail = JSON.parse(localStorage.getItem('currentUser')).user.userEmail;
      console.log(this.ecmrs);
      this.ecmrs = this.ecmrs.filter(ecmr =>
          ecmr.source.indexOf(userOrg) > 0 ||
        (ecmr.transporter.indexOf(userEmail) > 0 && ecmr.carrier.indexOf(userOrg)) > 0 ||
        ecmr.owner.indexOf(userOrg) > 0);
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => ecmr.status.toUpperCase() === 'OPEN');
    });
  }

  public setCurrentView(view: string) {
    this.currentView = view;
    this.ecmrsFiltered = this.ecmrs.filter(ecmr => ecmr.status.toUpperCase() === view.toUpperCase());
  }

}
