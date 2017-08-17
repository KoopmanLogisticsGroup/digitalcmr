import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {
  @Input() public ecmr: any;
  public updateComment: any;

  public addRemark() {
    this.updateComment = this.ecmr.carrierComments;
  }

  public constructor() {
  }

  public ngOnInit() {
  }
}
