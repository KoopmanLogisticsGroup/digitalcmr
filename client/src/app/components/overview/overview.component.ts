import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector:    'app-overview',
  templateUrl: './overview.component.html',
  styleUrls:   ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  public ecmrOverview           = false;
  public transportOrderOverview = false;

  public User = {
    CompoundAdmin:   'CompoundAdmin',
    CarrierMember:   'CarrierMember',
    RecipientMember: 'RecipientMember',
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };

  public constructor(private authenticationService: AuthenticationService) {
  }

  public ngOnInit(): void {
    if (this.getUserRole() === this.User.LegalOwnerAdmin) {
      this.ecmrOverview           = false;
      this.transportOrderOverview = true;
    } else {
      this.ecmrOverview           = true;
      this.transportOrderOverview = false;
    }
  }

  public changeToECMR() {
    this.ecmrOverview           = true;
    this.transportOrderOverview = false;
  }

  public changeToOrder() {
    this.ecmrOverview           = false;
    this.transportOrderOverview = true;
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }
}
