import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {SignOffModalComponent} from '../sign-off-modal/sign-off-modal.component';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector:    'app-goods',
  templateUrl: './goods.component.html',
  styleUrls:   ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {

  @ViewChild(SignOffModalComponent) public signOffModal: SignOffModalComponent;

  @Input() public ecmr: any;
  @Input() public selectedColumnIs: any;
  @Input() public selectedColumns: any;
  public EcmrStatus = {
    CREATED:             'CREATED',
    LOADED:              'LOADED',
    IN_TRANSIT:          'IN_TRANSIT',
    DELIVERED:           'DELIVERED',
    CONFIRMED_DELIVERED: 'CONFIRMED_DELIVERED'
  };

  public User = {
    CompoundAdmin:   'CompoundAdmin',
    CarrierMember:   'CarrierMember',
    RecipientMember: 'RecipientMember',
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };

  public constructor(private _authenticationService: AuthenticationService) {
  }

  public openModal(): void {
    this.signOffModal.open(this.ecmr);
  }

  public selectColumn() {
    if (this.selectedColumnIs === 0) {
      return 0;
    } else if (this.selectedColumnIs === 1) {
      return 1;
    } else if (this.selectedColumnIs === 2) {
      return 2;
    } else if (this.selectedColumnIs === 3) {
      return 3;
    }
  }

  public ngOnInit() {
  }

  public getUserRole(): string {
    return this._authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }

  public enableButton(): boolean {
    if (this.ecmr && this.ecmr.status === this.EcmrStatus.CREATED && this.getUserRole() === this.User.CompoundAdmin) {
      return true;
    } else if (this.ecmr && this.ecmr.status === this.EcmrStatus.LOADED && this.getUserRole() === this.User.CarrierMember) {
      return true;
    } else if (this.ecmr && this.ecmr.status === this.EcmrStatus.IN_TRANSIT && this.getUserRole() === this.User.CarrierMember) {
      return true;
    } else if (this.ecmr && this.ecmr.status === this.EcmrStatus.DELIVERED && this.getUserRole() === this.User.RecipientMember) {
      return true;
    }
  }
}
