import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CancelModalComponent} from '../../../transportorder-detail/cancel-modal/cancel-modal.component';
import {TransportOrder} from '../../../../interfaces/transportOrder.interface';
import {TransportOrderService} from '../../../../services/transportorder.service';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
  selector:    'app-transportorder-detail',
  templateUrl: './transportorder-detail.component.html',
  styleUrls:   ['./transportorder-detail.component.scss']
})
export class TransportorderDetailComponent implements OnInit {
  @ViewChild(CancelModalComponent) public cancelModal: CancelModalComponent;
  private orderID: string;
  public transportOrder: TransportOrder;

  public User = {
    CompoundAdmin:   'CompoundAdmin',
    CarrierMember:   'CarrierMember',
    RecipientMember: 'RecipientMember',
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };

  public constructor(private route: ActivatedRoute,
                     private transportOrderService: TransportOrderService,
                     private authenticationService: AuthenticationService) {
  }

  public ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.orderID = params['orderID'];
        this.transportOrderService.getTransportOrderByOrderID(this.orderID).subscribe((transportOrder: TransportOrder) => {
          this.transportOrder = transportOrder;
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
