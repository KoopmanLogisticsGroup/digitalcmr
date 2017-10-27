import {Component, OnInit} from '@angular/core';
import {EcmrService} from '../../services/ecmr.service';
import {ActivatedRoute} from '@angular/router';
import {NavbarService} from '../../services/navbar.service';
import {EcmrInterface} from '../../interfaces/ecmr.interface';
import {SignatureInterface} from '../../interfaces/signature.interface';

@Component({
  selector:    'app-ecmr-detail',
  templateUrl: './ecmr-detail.component.html',
  styleUrls:   ['./ecmr-detail.component.scss']
})
export class EcmrDetailComponent implements OnInit {

  public userRole: string;
  public ecmrID: string;
  public ecmr: EcmrInterface;
  public selectedColumns: boolean[];

  public constructor(private route: ActivatedRoute,
                     private ecmrService: EcmrService,
                     public nav: NavbarService) {
    this.selectedColumns = [false, false, false, false];
  }

  public ngOnInit(): void {
    this.nav.show();
    this.route.params
      .subscribe(params => {
        this.ecmrID = params['ecmrID'];
        this.ecmrService.getECMRByID(this.ecmrID).subscribe((ecmr: EcmrInterface) => {
          this.ecmr     = ecmr;
          this.userRole = JSON.parse(localStorage.getItem('currentUser')).user.role;
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
              if (this.userRole === 'LegalOwnerAdmin') {
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
          this.instantiateRemarks();
          if (this.userRole === 'CompoundAdmin' && !this.ecmr.compoundSignature) {
            this.ecmr.compoundSignature = this.imitateSignature();
          } else if (this.userRole === 'CarrierMember' && this.ecmr.status === 'LOADED' && !this.ecmr.carrierDeliverySignature) {
            this.ecmr.carrierLoadingSignature = this.imitateSignature();
          } else if (this.userRole === 'CarrierMember' && this.ecmr.status === 'IN_TRANSIT' && !this.ecmr.carrierDeliverySignature) {
            this.ecmr.carrierDeliverySignature = this.imitateSignature();
          } else if (this.userRole === 'RecipientMember' && !this.ecmr.recipientSignature) {
            this.ecmr.recipientSignature = this.imitateSignature();
          }
        });
      });
  }

  private imitateSignature(): SignatureInterface {
    return {
      certificate: this.userRole,
      latitude: 0,
      longitude: 0,
      generalRemark: {
        isDamaged: false,
        comments: ''
      }
    };
  }

  public instantiateRemarks(): void {
    for (const good of this.ecmr.goods) {
      if (!good.compoundRemark) {
        good.compoundRemark = {
          'comments':  '',
          'isDamaged': false
        };
      }
      if (!good.carrierLoadingRemark) {
        good.carrierLoadingRemark = {
          'comments':  '',
          'isDamaged': false
        };
      }
      if (!good.carrierDeliveryRemark) {
        good.carrierDeliveryRemark = {
          'comments':  '',
          'isDamaged': false
        };
      }
      if (!good.recipientRemark) {
        good.recipientRemark = {
          'comments':  '',
          'isDamaged': false
        };
      }
    }
  }
}
