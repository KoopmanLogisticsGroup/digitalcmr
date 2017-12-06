import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CancelModalComponent} from './cancel-modal/cancel-modal.component';
import {TransportOrder} from '../../../../interfaces/transportOrder.interface';
import {TransportOrderService} from '../../../../services/transportorder.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {EcmrService} from '../../../../services/ecmr.service';
import {Ecmr} from '../../../../interfaces/ecmr.interface';

@Component({
  selector:    'app-transportorder-detail',
  templateUrl: './transportorder-detail.component.html',
  styleUrls:   ['./transportorder-detail.component.scss']
})
export class TransportorderDetailComponent implements OnInit {
  @ViewChild(CancelModalComponent)
  public cancelModal: CancelModalComponent;
  private orderID: string;
  public transportOrder: TransportOrder;
  public ecmrs: Ecmr[];

  public User = {
    CompoundAdmin:   'CompoundAdmin',
    CarrierMember:   'CarrierMember',
    RecipientMember: 'RecipientMember',
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };

  public TransportOrderStatus = {
    Open:       'OPEN',
    InProgress: 'IN_PROGRESS',
    Completed:  'COMPLETED',
    Cancelled:  'CANCELLED'
  };

  public constructor(private route: ActivatedRoute,
                     private transportOrderService: TransportOrderService,
                     private authenticationService: AuthenticationService,
                     private ecmrService: EcmrService) {
  }

  public ngOnInit(): void {
    this.orderID = this.route.snapshot.paramMap.get('orderID');
    this.transportOrderService.getTransportOrderByOrderID(this.orderID)
      .subscribe((transportOrder: TransportOrder) => {
        this.transportOrder = transportOrder;
        this.ecmrService.getEcmrsByTransportOrderID(this.orderID)
          .subscribe((ecmrs: Ecmr[]) => {
            this.ecmrs = ecmrs;
          });
      });
  }

  public openModal(): void {
    this.cancelModal.open(this.transportOrder);
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }
}
