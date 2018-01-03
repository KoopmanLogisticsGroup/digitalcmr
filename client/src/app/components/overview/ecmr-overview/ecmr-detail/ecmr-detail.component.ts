import {Component, OnInit} from '@angular/core';
import {EcmrService} from '../../../../services/ecmr.service';
import {ActivatedRoute} from '@angular/router';
import {NavbarService} from '../../../../services/navbar.service';
import {Ecmr, EcmrStatus} from '../../../../interfaces/ecmr.interface';
import {Signature} from '../../../../interfaces/signature.interface';
import {UserRole} from '../../../../interfaces/user.blockchain.interface';

@Component({
  selector:    'app-ecmr-detail',
  templateUrl: './ecmr-detail.component.html',
  styleUrls:   ['./ecmr-detail.component.scss']
})
export class EcmrDetailComponent implements OnInit {

  public userRole: string;
  public ecmrID: string;
  public ecmr: Ecmr;
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
        this.ecmrService.getECMRByID(this.ecmrID).subscribe((ecmr: Ecmr) => {
          this.ecmr     = ecmr;
          this.userRole = JSON.parse(localStorage.getItem('currentUser')).user.role;
          switch (this.ecmr.status) {
            case EcmrStatus.Created: {
              this.selectedColumns[0] = true;
              break;
            }
            case EcmrStatus.Loaded: {
              this.selectedColumns[1] = true;
              break;
            }
            case EcmrStatus.InTransit: {
              this.selectedColumns[2] = true;
              break;
            }
            case EcmrStatus.Delivered: {
              if (this.userRole === UserRole.LegalOwnerAdmin) {
                this.selectedColumns[0] = true;
                break;
              }
              this.selectedColumns[3] = true;
              break;
            }
            case EcmrStatus.ConfirmedDelivered: {
              this.selectedColumns[3] = true;
              break;
            }
          }
          this.instantiateRemarks();
          if (this.userRole === UserRole.CompoundAdmin && !this.ecmr.compoundSignature) {
            this.ecmr.compoundSignature = this.placeEmptySignature();
          } else if (this.userRole === UserRole.CarrierMember && this.ecmr.status === EcmrStatus.Loaded
            && !this.ecmr.carrierDeliverySignature) {
            this.ecmr.carrierLoadingSignature = this.placeEmptySignature();
          } else if (this.userRole === UserRole.CarrierMember && this.ecmr.status === EcmrStatus.InTransit
            && !this.ecmr.carrierDeliverySignature) {
            this.ecmr.carrierDeliverySignature = this.placeEmptySignature();
          } else if (this.userRole === UserRole.RecipientMember && !this.ecmr.recipientSignature) {
            this.ecmr.recipientSignature = this.placeEmptySignature();
          }
        });
      });
  }

  private placeEmptySignature(): Signature {
    return <Signature> {
      longitude:     0,
      latitude:      0,
      certificate:   null,
      timestamp:     0,
      generalRemark: {
        comments:  '',
        isDamaged: false
      }
    }
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
