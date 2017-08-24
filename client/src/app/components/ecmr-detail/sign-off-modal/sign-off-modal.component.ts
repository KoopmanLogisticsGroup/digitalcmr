import {Component, Input, OnInit} from '@angular/core';
import {EcmrService} from '../../../services/ecmr.service';
import {Ecmr} from '../../../classes/ecmr.model';

@Component({
  selector: 'app-sign-off-modal',
  templateUrl: './sign-off-modal.component.html',
  styleUrls: ['./sign-off-modal.component.scss']
})

export class SignOffModalComponent implements OnInit {

  @Input() ecmr: any;

  public constructor(private ecmrService: EcmrService) {
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
}


