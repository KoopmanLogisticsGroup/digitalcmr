import {Component, OnInit} from '@angular/core';
import {EcmrService} from '../../services/ecmr.service';
import {ActivatedRoute} from '@angular/router';
import {CarrierLoadingRemark} from '../../classes/remark.model';

@Component({
  selector   : 'app-ecmr-detail',
  templateUrl: './ecmr-detail.component.html',
  styleUrls  : ['./ecmr-detail.component.scss']
})
export class EcmrDetailComponent implements OnInit {

  public userRole: string;
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
        this.ecmrService.getECMRByID(this.ecmrID).subscribe(ecmr => {
          this.ecmr     = ecmr;
          this.userRole = JSON.parse(localStorage.getItem('currentUser')).user.role;
          console.log(JSON.parse(localStorage.getItem('currentUser')).user);
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
              if (this.userRole === 'owner') {
                this.selectedColumns[0] = true;
                break;
              }
              this.selectedColumns[3] = true;
              break;
            }
            case 'CONFIRMED_DELIVERED': {
              this.selectedColumns[3] = true;
              break;
            }
          }
          for (const good of this.ecmr.goods) {
            if (!good.carrierLoadingRemark) {
              good.carrierLoadingRemark = {
                'comments' : '',
                'isDamaged': false
              };
            }
          }
          if (this.userRole === 'source') {
            this.ecmr.compoundSignature = {};
          } else if (this.userRole === 'carrier' && ecmr.status === 'LOADED') {
            this.ecmr.carrierLoadingSignature = {};
          } else if (this.userRole === 'carrier') {
            this.ecmr.carrierDeliverySignature = {};
          } else if (this.userRole === 'recipient') {
            this.ecmr.recipientSignature = {};
          }
        });
      });
  }
}
