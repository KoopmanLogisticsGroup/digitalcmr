import {Component, OnInit} from '@angular/core';
import {EcmrService} from '../../../services/ecmr.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  public ecmrID: any;
  public ecmr: any;

  public constructor(private route: ActivatedRoute,
                     private ecmrService: EcmrService) {
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
        });
      });
  };
}
