import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {SignOffModalComponent} from '../sign-off-modal/sign-off-modal.component';

@Component({
  selector   : 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls  : ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {

  @ViewChild(SignOffModalComponent) public signOffModal: SignOffModalComponent;

  @Input() public ecmr: any;

  public constructor() {
  }

  public openModal(): void {
    console.log(this.ecmr);
    this.signOffModal.open(this.ecmr);
  }

  public ngOnInit() {

  }
}
