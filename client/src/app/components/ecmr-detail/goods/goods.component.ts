import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {EcmrService} from '../../../services/ecmr.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {

  public ecmr: any;
  public ecmrID: any;
  public updateComment: any;

  addRemark() {
    this.updateComment = this.ecmr.carrierComments;
  }

  constructor(private route: ActivatedRoute,
              private ecmrService: EcmrService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.ecmrID = params['ecmrID'];
        this.ecmrService.getAllEcmrs('').subscribe(ecmrs => {
          this.ecmr = ecmrs instanceof Array ? ecmrs.filter(x => x.ecmrID === this.ecmrID) : undefined;
          if (this.ecmr.length) {
            this.ecmr = this.ecmr[0];
          }
        });
      });

  }
}
