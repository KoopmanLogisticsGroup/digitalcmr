import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {SignOffModalComponent} from '../sign-off-modal/sign-off-modal.component';
import {AuthenticationService} from '../../../../../services/authentication.service';
import {Ecmr} from '../../../../../interfaces/ecmr.interface';

@Component({
  selector:    'app-goods',
  templateUrl: './goods.component.html',
  styleUrls:   ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {
  @ViewChild(SignOffModalComponent) public signOffModal: SignOffModalComponent;
  @Input() public ecmr: Ecmr;
  @Input() public selectedColumnIs: number;
  @Input() public selectedColumns: number;

  public EcmrStatus = {
    Created:            'CREATED',
    Loaded:             'LOADED',
    InTransit:          'IN_TRANSIT',
    Delivered:          'DELIVERED',
    ConfirmedDelivered: 'CONFIRMED_DELIVERED'
  };

  public User = {
    CompoundAdmin:   'CompoundAdmin',
    CarrierMember:   'CarrierMember',
    RecipientMember: 'RecipientMember',
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };


  public constructor(private authenticationService: AuthenticationService) {
  }

  public openModal(): void {
    this.signOffModal.open(this.ecmr);
  }

  public selectColumn(): number {
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

  public ngOnInit(): void {
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }

  public enableButton(): boolean {
    if (this.ecmr && this.ecmr.status === this.EcmrStatus.Created && this.getUserRole() === this.User.CompoundAdmin) {
      return true;
    } else if (this.ecmr && this.ecmr.status === this.EcmrStatus.Loaded && this.getUserRole() === this.User.CarrierMember) {
      return true;
    } else if (this.ecmr && this.ecmr.status === this.EcmrStatus.InTransit && this.getUserRole() === this.User.CarrierMember) {
      return true;
    } else if (this.ecmr && this.ecmr.status === this.EcmrStatus.Delivered && this.getUserRole() === this.User.RecipientMember) {
      return true;
    }
  }
}