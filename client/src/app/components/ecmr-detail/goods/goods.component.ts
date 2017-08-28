import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {SignOffModalComponent} from '../sign-off-modal/sign-off-modal.component';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector   : 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls  : ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {

  @ViewChild(SignOffModalComponent) public signOffModal: SignOffModalComponent;

  @Input() public ecmr: any;

  public constructor(private _authenticationService: AuthenticationService) {
  }

  public openModal(): void {
    this.signOffModal.open(this.ecmr);
    console.log(this.ecmr);
  }

  public ngOnInit() {
  }

  public userRole(): string {
    if (this._authenticationService.isAuthenticated()) {
      const userRole = JSON.parse(localStorage.getItem('currentUser')).user.role;
      return userRole;
    }
    return null;
  }

  public enableButton() {
    if (this.ecmr && this.ecmr.status === 'CREATED' && this.userRole() === 'CompoundAdmin') {
      return true;
    } else if (this.ecmr && this.ecmr.status === ('LOADED' || 'IN_TRANSIT') && this.userRole() === 'CarrierMember') {
      return true;
    } else if (this.ecmr && this.ecmr.status === ('DELIVERED' || 'CONFIRMED_DELIVERED') && this.userRole() === 'RecipientMember') {
      return true;
    }
  }
}
