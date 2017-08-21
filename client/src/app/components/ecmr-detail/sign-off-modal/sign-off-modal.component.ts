import {Component, Input, OnInit} from '@angular/core';
import {EcmrService} from '../../../services/ecmr.service';
import {Ecmr} from '../../../classes/ecmr.model';

@Component({
  selector: 'app-sign-off-modal',
  templateUrl: './sign-off-modal.component.html',
  styleUrls: ['./sign-off-modal.component.scss']
})

export class SignOffModalComponent implements OnInit {

  @Input() ecmr: Ecmr;

  public constructor(private ecmrService: EcmrService) {
    this.ecmr = new Ecmr();
  }

  public ngOnInit() {
  }

  public open(ecmr: Ecmr): void {
    this.ecmr = ecmr;
    $('#signoff-modal.ui.modal').modal('show');
    $('#signoff-modal.ui.modal').parent().css({'background-color': 'rgba(0,0,0,0.7)'});
  }

  public close(): void {
    $('#signoff-modal.ui.modal').modal('hide');
  }

  public onSubmit() {
    // this.ecmrService.updateEcmr(this.ecmr).subscribe(result => {
    // });
    console.log(this.ecmr);
    $('#signoff-modal.ui.modal').modal('hide');
  }
}


