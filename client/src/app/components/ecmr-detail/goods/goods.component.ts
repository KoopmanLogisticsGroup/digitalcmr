import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {EcmrService} from '../../../services/ecmr.service';
import {ActivatedRoute} from '@angular/router';

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

  public constructor(private route: ActivatedRoute,
              private ecmrService: EcmrService) {
  }

  public ngOnInit() {
  }
}
