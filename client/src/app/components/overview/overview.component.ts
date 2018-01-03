import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {UserRole} from '../../interfaces/user.blockchain.interface';

@Component({
  selector:    'app-overview',
  templateUrl: './overview.component.html',
  styleUrls:   ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  public ecmrOverview: boolean;
  public transportOrderOverview: boolean;
  public UserRole = {
    CompoundAdmin:   'CompoundAdmin',
    CarrierMember:   'CarrierMember',
    RecipientMember: 'RecipientMember',
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };

  public constructor(private authenticationService: AuthenticationService) {
  }

  public ngOnInit(): void {
    if (this.getUserRole() === UserRole.LegalOwnerAdmin) {
      this.ecmrOverview           = false;
      this.transportOrderOverview = true;
    } else {
      this.ecmrOverview           = true;
      this.transportOrderOverview = false;
    }
  }

  public changeToECMR(): void {
    this.ecmrOverview           = true;
    this.transportOrderOverview = false;
  }

  public changeToOrder(): void {
    this.ecmrOverview           = false;
    this.transportOrderOverview = true;
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }
}
