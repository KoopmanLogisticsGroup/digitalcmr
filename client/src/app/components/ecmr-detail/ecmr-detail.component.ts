import {Component, OnInit} from '@angular/core';
import {EcmrService} from '../../services/ecmr.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-ecmr-detail',
  templateUrl: './ecmr-detail.component.html',
  styleUrls: ['./ecmr-detail.component.scss']
})
export class EcmrDetailComponent implements OnInit {

  public ecmrID: any;
  public ecmr: any;
  public selectedColumns: boolean[];

  public constructor(private route: ActivatedRoute,
                     private ecmrService: EcmrService) {
    this.selectedColumns = [false, false, false, false];
  }

  public ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.ecmrID = params['ecmrID'];
        this.ecmrService.getAllEcmrs('').subscribe(ecmrs => {
          this.ecmr = ecmrs instanceof Array ? ecmrs.filter(x => x.ecmrID === this.ecmrID) : undefined;
          if (this.ecmr.length) {
            this.ecmr = this.ecmr[0];
          }
          switch (this.ecmr.status) {
            case 'CREATED': {
              this.selectedColumns[0] = true;
              break;
            }
            case 'LOADED': {
              this.selectedColumns[1] = true;
              break;
            }
            case 'IN_TRANSIT': {
              this.selectedColumns[2] = true;
              break;
            }
            case 'DELIVERED': {
              this.selectedColumns[3] = true;
              break;
            }
          }
        });
      });
  }
}
