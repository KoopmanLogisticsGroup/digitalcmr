import {Component, OnInit, ViewChild} from '@angular/core';
import {SignOffModalComponent} from './sign-off-modal/sign-off-modal.component';

@Component({
  selector: 'app-ecmr-detail',
  templateUrl: './ecmr-detail.component.html',
  styleUrls: ['./ecmr-detail.component.scss']
})
export class EcmrDetailComponent implements OnInit {
  @ViewChild(SignOffModalComponent) public signOffModal: SignOffModalComponent;


  constructor() {
  }


  ngOnInit() {
  }

  public openModal(): void {
    this.signOffModal.open();
  }

}
