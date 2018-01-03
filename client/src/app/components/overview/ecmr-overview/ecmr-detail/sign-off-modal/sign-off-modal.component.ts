import {Component, Input, OnInit} from '@angular/core';
import {EcmrService} from '../../../../../services/ecmr.service';
import {AuthenticationService} from '../../../../../services/authentication.service';
import {Ecmr, EcmrStatus} from '../../../../../interfaces/ecmr.interface';
import * as GeoLib from 'geolib';
import PositionAsDecimal = geolib.PositionAsDecimal;
import {Address} from '../../../../../interfaces/address.interface';
import {Signature} from '../../../../../interfaces/signature.interface';
import {UpdateEcmrStatus} from '../../../../../interfaces/updateEcmrStatus.interface';

@Component({
  selector:    'app-sign-off-modal',
  templateUrl: './sign-off-modal.component.html',
  styleUrls:   ['./sign-off-modal.component.scss']
})

export class SignOffModalComponent implements OnInit {
  @Input() ecmr: Ecmr;
  private signature: Signature = <Signature>{};

  public EcmrStatus = {
    Created:            'CREATED',
    Loaded:             'LOADED',
    InTransit:          'IN_TRANSIT',
    Delivered:          'DELIVERED',
    ConfirmedDelivered: 'CONFIRMED_DELIVERED'
  };

  public User = {
    CompoundAdmin:   'CompoundAdmin',
    CarrierMember:   'CarrierMember',
    RecipientMember: 'RecipientMember',
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };

  public constructor(private ecmrService: EcmrService,
                     private authenticationService: AuthenticationService) {
  }

  public ngOnInit(): void {
  }

  public open(ecmr: Ecmr): void {
    this.ecmr = ecmr;
    $('#signoff_modal.ui.modal').modal('show');
    $('#signoff_modal.ui.modal').parent().css({'background-color': 'rgba(0,0,0,0.7)'});
  }

  public close(): void {
    $('#signoff_modal.ui.modal').modal('hide');
  }

  public onSubmit(): void {
    $('#submitButton').addClass('basic loading');
    this.simulateCoordinates();
    this.setGeneralRemark();
    const updateEcmrStatus: UpdateEcmrStatus = {
      ecmrID:    this.ecmr.ecmrID,
      goods:     this.ecmr.goods,
      signature: this.signature,
      orderID:   this.ecmr.orderID
    };

    this.ecmrService.updateEcmr(updateEcmrStatus, this.ecmr.status).subscribe(result => {
      $('#signoff_modal.ui.modal').modal('hide');
      $('#signoff_modal.ui.modal').modal('hide');
      location.reload();
    });
  }

  private simulateCoordinates(): void {
    switch (this.getUserRole()) {
      case this.User.CompoundAdmin: {
        const signaturePoint: PositionAsDecimal = this.generateSignaturePoint(this.ecmr.loading.address);
        this.ecmr.compoundSignature.latitude    = signaturePoint.latitude;
        this.ecmr.compoundSignature.longitude   = signaturePoint.longitude;

        break;
      }

      case this.User.CarrierMember: {
        if (this.ecmr.status === EcmrStatus.Loaded) {
          const signaturePoint: PositionAsDecimal     = this.generateSignaturePoint(this.ecmr.loading.address);
          this.ecmr.carrierLoadingSignature.latitude  = signaturePoint.latitude;
          this.ecmr.carrierLoadingSignature.longitude = signaturePoint.longitude;
        } else if (this.ecmr.status === EcmrStatus.InTransit) {
          const signaturePoint: PositionAsDecimal      = this.generateSignaturePoint(this.ecmr.delivery.address);
          this.ecmr.carrierDeliverySignature.latitude  = signaturePoint.latitude;
          this.ecmr.carrierDeliverySignature.longitude = signaturePoint.longitude;
        }

        break;
      }

      case this.User.RecipientMember: {
        const signaturePoint: PositionAsDecimal = this.generateSignaturePoint(this.ecmr.delivery.address);
        this.ecmr.recipientSignature.latitude   = signaturePoint.latitude;
        this.ecmr.recipientSignature.longitude  = signaturePoint.longitude;

        break;
      }

      default: {
        break;
      }
    }
  }

  private generateSignaturePoint(address: Address): PositionAsDecimal {
    const start          = {
      latitude:  address.latitude,
      longitude: address.longitude
    };
    const signaturePoint = GeoLib.computeDestinationPoint(
      start,
      Math.abs(Math.random() * 500),
      Math.abs(Math.random() * 180),
      undefined
    );

    return signaturePoint;
  }

  private setGeneralRemark(): void {
    switch (this.getUserRole()) {
      case this.User.CompoundAdmin: {
        this.signature.generalRemark = this.ecmr.compoundSignature.generalRemark;

        break;
      }
      case this.User.CarrierMember: {
        if (this.ecmr.status === EcmrStatus.Loaded) {
          this.signature.generalRemark = this.ecmr.carrierLoadingSignature.generalRemark;
        } else if (this.ecmr.status === EcmrStatus.InTransit) {
          this.signature.generalRemark = this.ecmr.carrierDeliverySignature.generalRemark;
        }

        break;
      }

      case this.User.RecipientMember: {
        this.signature.generalRemark = this.ecmr.recipientSignature.generalRemark;

        break;
      }

      default: {
        break;
      }
    }
  }

  public checkUser(activeUser, ecmrStatus): boolean {
    return this.getUserRole() === activeUser && (this.ecmr ? this.ecmr.status === ecmrStatus : false);
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }
}
