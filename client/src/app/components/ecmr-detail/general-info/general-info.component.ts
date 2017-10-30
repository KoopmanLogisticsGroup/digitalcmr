import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector:    'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls:   ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {
  @Input() public ecmr: any;
  @Input() public selectedColumns: boolean[];

  public selectedImage: boolean[];
  public selectedColumnIs: any;

  public constructor(private _authenticationService: AuthenticationService) {
    this.selectedImage = [false, false, false, false];
  }

  public selectColumn(number: number): void {
    if (this.ecmr.status === 'DELIVERED' || this.ecmr.status === 'CONFIRMED_DELIVERED') {
      this.selectedImage.forEach((val, index) => {
        if (number === index) {
          this.selectedImage[index]   = true;
          this.selectedColumns[index] = true;
          this.selectedColumnIs       = number;
        } else {
          this.selectedImage[index]   = false;
          this.selectedColumns[index] = false;
        }
      });
    }
  }

  public defineSelectedColumn(): void {
    this.selectedColumns.forEach((val, index) => {
      if (this.selectedColumns[index]) {
        this.selectedImage[index]   = true;
        this.selectedColumns[index] = true;
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

  public ngOnInit() {
    this.defineSelectedColumn();
  }
}
