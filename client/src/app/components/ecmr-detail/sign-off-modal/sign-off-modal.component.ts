import {Component, Input, OnInit} from '@angular/core';
import {EcmrService} from '../../../services/ecmr.service';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector   : 'app-sign-off-modal',
  templateUrl: './sign-off-modal.component.html',
  styleUrls  : ['./sign-off-modal.component.scss']
})

export class SignOffModalComponent implements OnInit {

  @Input() ecmr: any;

  public constructor(private ecmrService: EcmrService,
                     private _authenticationService: AuthenticationService) {
  }

  public ngOnInit() {
  }

  public open(ecmr: any): void {
    this.ecmr = ecmr;
    $('#signoff-modal.ui.modal').modal('show');
    $('#signoff-modal.ui.modal').parent().css({'background-color': 'rgba(0,0,0,0.7)'});
  }

  public close(): void {
    $('#signoff-modal.ui.modal').modal('hide');
  }

  public onSubmit() {
    $('#submitButton').addClass('basic loading');
    this.ecmrService.updateEcmr(this.ecmr).subscribe(result => {
      $('#signoff-modal.ui.modal').modal('hide');
      location.reload();
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


