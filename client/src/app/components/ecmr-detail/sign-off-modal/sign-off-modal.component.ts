import {Component, Input, OnInit} from '@angular/core';
import {EcmrService} from '../../../services/ecmr.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {EcmrInterface} from '../../../interfaces/ecmr.interface';
import * as GeoLib from 'geolib';

@Component({
  selector:    'app-sign-off-modal',
  templateUrl: './sign-off-modal.component.html',
  styleUrls:   ['./sign-off-modal.component.scss']
})

export class SignOffModalComponent implements OnInit {

  @Input() ecmr: EcmrInterface;

  public constructor(private ecmrService: EcmrService,
                     private _authenticationService: AuthenticationService) {
  }

  public ngOnInit(): void {
  }

  public open(ecmr: EcmrInterface): void {
    this.ecmr = ecmr;
    $('#signoff-modal.ui.modal').modal('show');
    $('#signoff-modal.ui.modal').parent().css({'background-color': 'rgba(0,0,0,0.7)'});
    this.simulateCoordinates();
  }

  public close(): void {
    $('#signoff-modal.ui.modal').modal('hide');
  }

  public onSubmit(): void {
    $('#submitButton').addClass('basic loading');
    this.ecmrService.updateEcmr(this.ecmr).subscribe(result => {
      $('#signoff-modal.ui.modal').modal('hide');
      location.reload();
    });
  }

  public userRole(): string {
    if (this._authenticationService.isAuthenticated()) {
      const userRole = JSON.parse(localStorage.getItem('currentUser')).user.role;
      return userRole;
    }
    return null;
  }

  private simulateCoordinates(): void {

    switch (this.userRole()) {

      case 'CompoundAdmin': {
        const start                           = {
          latitude:  this.ecmr.loading.address.latitude,
          longitude: this.ecmr.loading.address.longitude
        };
        const signaturePoint                  = GeoLib.computeDestinationPoint(
          start,
          Math.abs(Math.random() * 500),
          Math.abs(Math.random() * 180),
          undefined
        );
        this.ecmr.compoundSignature.latitude  = signaturePoint.latitude;
        this.ecmr.compoundSignature.longitude = signaturePoint.longitude;
        break;
      }

      case 'CarrierMember': {

        if (this.ecmr.status === 'LOADED') {
          const start          = {
            latitude:  this.ecmr.loading.address.latitude,
            longitude: this.ecmr.loading.address.longitude
          };
          const signaturePoint = GeoLib.computeDestinationPoint(
            start,
            Math.abs(Math.random() * 500),
            Math.abs(Math.random() * 180),
            undefined
          );

          this.ecmr.carrierLoadingSignature.latitude  = signaturePoint.latitude;
          this.ecmr.carrierLoadingSignature.longitude = signaturePoint.longitude;
        }

        if (this.ecmr.status === 'IN_TRANSIT') {
          const start          = {
            latitude:  this.ecmr.delivery.address.latitude,
            longitude: this.ecmr.delivery.address.longitude
          };
          const signaturePoint = GeoLib.computeDestinationPoint(
            start,
            Math.abs(Math.random() * 500),
            Math.abs(Math.random() * 180),
            undefined
          );

          this.ecmr.carrierDeliverySignature.latitude  = signaturePoint.latitude;
          this.ecmr.carrierDeliverySignature.longitude = signaturePoint.longitude;
        }

        break;
      }

      case 'RecipientMember': {
        const start          = {
          latitude:  this.ecmr.delivery.address.latitude,
          longitude: this.ecmr.delivery.address.longitude
        };
        const signaturePoint = GeoLib.computeDestinationPoint(
          start,
          Math.abs(Math.random() * 500),
          Math.abs(Math.random() * 180),
          undefined
        );

        this.ecmr.recipientSignature.latitude  = signaturePoint.latitude;
        this.ecmr.recipientSignature.longitude = signaturePoint.longitude;
        break;
      }

      default: {
        break;
      }

    }
  }
}


