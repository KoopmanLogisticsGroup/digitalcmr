import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {EcmrInterface} from '../../../interfaces/ecmr.interface';

@Component({
  selector:    'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls:   ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {
  @Input() public ecmr: EcmrInterface;
  @Input() public selectedColumns: boolean[];

  public selectedImage: boolean[];
  public selectedColumnIs: number;
  public EcmrStatus = {
    CREATED:             'CREATED',
    LOADED:              'LOADED',
    IN_TRANSIT:          'IN_TRANSIT',
    DELIVERED:           'DELIVERED',
    CONFIRMED_DELIVERED: 'CONFIRMED_DELIVERED'
  };

  public User = {
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };

  public constructor(private authenticationService: AuthenticationService) {
    this.selectedImage = [false, false, false, false];
  }

  public ngOnInit(): void {
    this.defineSelectedColumn();
  }

  public selectColumn(number: number): void {
    if (this.ecmr.status === this.EcmrStatus.DELIVERED || this.ecmr.status === this.EcmrStatus.CONFIRMED_DELIVERED) {
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

  public userRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }

  public selectImage() {
    if (this.selectedImage[0] || this.userRole() === this.User.LegalOwnerAdmin) {
      return 'selectedImg1';
    } else if (this.selectedImage[1]) {
      return 'selectedImg2';
    } else if (this.selectedImage[2]) {
      return 'selectedImg3';
    } else if (this.selectedImage[3]) {
      return 'selectedImg4';
    }
  }
}
