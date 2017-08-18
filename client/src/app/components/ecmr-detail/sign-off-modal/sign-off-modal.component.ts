import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sign-off-modal',
  templateUrl: './sign-off-modal.component.html',
  styleUrls: ['./sign-off-modal.component.scss']
})

export class SignOffModalComponent implements OnInit {


  constructor() {
  }

  ngOnInit() {
  }

  public open(): void {
    $('#signoff-modal.ui.modal').modal('show');
    $('#signoff-modal.ui.modal').parent().css({'background-color': 'rgba(0,0,0,0.7)'});
  }

  public close(): void {
    $('#signoff-modal.ui.modal').modal('hide');
  }

  public dummyFunction(): void {
    alert('Ey mate, nothing happening yet');
  }
}


