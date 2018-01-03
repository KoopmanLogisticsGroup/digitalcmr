import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../../services/authentication.service';
import {Ecmr, EcmrStatus} from '../../../../../interfaces/ecmr.interface';

@Component({
  selector:    'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls:   ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {
  @Input() public ecmr: Ecmr;
  @Input() public selectedColumns: boolean[];

  public selectedImage: boolean[];
  public selectedColumnIs: number;
  public UserRole   = {
    CompoundAdmin:   'CompoundAdmin',
    CarrierMember:   'CarrierMember',
    RecipientMember: 'RecipientMember',
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };
  public EcmrStatus = {
    Created:            'CREATED',
    Loaded:             'LOADED',
    InTransit:          'IN_TRANSIT',
    Delivered:          'DELIVERED',
    ConfirmedDelivered: 'CONFIRMED_DELIVERED',
    Cancelled:          'CANCELLED'
  };

  public constructor(private authenticationService: AuthenticationService) {
    this.selectedImage = [false, false, false, false];
  }

  public ngOnInit(): void {
    this.defineSelectedColumn();
  }

  public selectColumn(number: number): void {
    if (this.ecmr.status === EcmrStatus.Delivered || this.ecmr.status === EcmrStatus.ConfirmedDelivered) {
      this.selectedImage.forEach((val, index) => {
        if (number === index) {
          this.selectedImage[index]   = true;
          this.selectedColumns[index] = true;
          this.selectedColumnIs       = number;
        } else {
          this.selectedImage[index]   = false;
          this.selectedColumns[index] = false;
        }
      })
    }
  }

  public defineSelectedColumn(): void {
    this.selectedColumns.forEach((val, index) => {
      if (this.selectedColumns[index]) {
        this.selectedImage[index]   = true;
        this.selectedColumns[index] = true;
      }
    })
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }
}
