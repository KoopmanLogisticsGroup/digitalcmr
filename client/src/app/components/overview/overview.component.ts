import {Component, OnInit} from '@angular/core';
import {EcmrService} from '../../services/ecmr.service';
import {AuthenticationService} from '../../services/authentication.service';
import {Ecmrs} from '../../models/ecmrs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public currentView = 'OPEN';

  private ecmrs: any;
  private ecmrsFiltered: any;

  public constructor(private ecmrService: EcmrService,
                     private _authenticationService: AuthenticationService) {
  }

  public ngOnInit() {
    this.ecmrService.getAllEcmrs().subscribe(ecmrs => {
      this.ecmrs = ecmrs instanceof Array ? ecmrs : new Array(ecmrs);
      // TODO implement in backend
      const userOrg = JSON.parse(localStorage.getItem('currentUser')).user.org;
      const userEmail = JSON.parse(localStorage.getItem('currentUser')).user.userEmail;
      this.ecmrs = this.ecmrs.filter(ecmr =>
        ecmr.source.indexOf(userOrg) > 0 ||
        (ecmr.transporter.indexOf(userEmail) > 0 && ecmr.carrier.indexOf(userOrg)) > 0 ||
        ecmr.owner.indexOf(userOrg) > 0 ||
        ecmr.recipient.indexOf(userOrg) > 0);
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => ecmr.status.toUpperCase() === 'CREATED');
      this.firstView();
    });
  }

  private firstView(): void {
    if (this.userRole() === 'source') {
      this.currentView = 'OPEN';
    } else if (this.userRole() === 'carrier' || this.userRole() === 'recipient') {
      this.currentView = 'IN_PROGRESS';
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
        if (this.currentView === 'IN_PROGRESS' && (ecmr.status === 'LOADED' || ecmr.status === 'IN_TRANSIT')) {
          return ecmr;
        }
      });
    } else if (this.userRole() === 'owner') {
      this.currentView = 'COMPLETED';
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => ecmr.status.toUpperCase() === ('DELIVERED'));
    }
  }

  public setCurrentView(view: string): any {
    this.currentView = view;
    this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
      if (this.currentView === 'OPEN' && ecmr.status === 'CREATED') {
        return ecmr;
      } else if (this.currentView === 'IN_PROGRESS' && (ecmr.status === 'LOADED' || ecmr.status === 'IN_TRANSIT')) {
        return ecmr;
      } else if (this.currentView === 'COMPLETED' && ecmr.status === 'DELIVERED') {
        return ecmr;
      }
    });
  }

  public userRole(): string {
    if (this._authenticationService.isAuthenticated()) {
      const userRole = JSON.parse(localStorage.getItem('currentUser')).user.role;
      return userRole;
    }
    return null;
  }
}
