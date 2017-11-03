import {Component, Input, OnInit} from '@angular/core';
import {EcmrService} from '../../../services/ecmr.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {Ecmr} from '../../../interfaces/ecmr.interface';
import * as GeoLib from 'geolib';

@Component({
  selector:    'app-sign-off-modal',
  templateUrl: './sign-off-modal.component.html',
  styleUrls:   ['./sign-off-modal.component.scss']
})

export class SignOffModalComponent implements OnInit {

  @Input() ecmr: Ecmr;
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
    this.simulateCoordinates();
  }

  public close(): void {
    $('#signoff_modal.ui.modal').modal('hide');
  }

  public onSubmit(): void {
    $('#submitButton').addClass('basic loading');
    this.ecmrService.updateEcmr(this.ecmr).subscribe(result => {
      $('#signoff_modal.ui.modal').modal('hide');
      $('#signoff_modal.ui.modal').modal('hide');
      location.reload();
    });
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }

  private simulateCoordinates(): void {
    switch (this.getUserRole()) {
      case this.User.CompoundAdmin: {
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

      case this.User.CarrierMember: {

        if (this.ecmr.status === this.EcmrStatus.Loaded) {
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

        if (this.ecmr.status === this.EcmrStatus.InTransit) {
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

      case this.User.RecipientMember: {
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

  public checkUser(activeUser, ecmrStatus): boolean {
    return this.getUserRole() === activeUser && (this.ecmr ? this.ecmr.status === ecmrStatus : false);
  }
}
