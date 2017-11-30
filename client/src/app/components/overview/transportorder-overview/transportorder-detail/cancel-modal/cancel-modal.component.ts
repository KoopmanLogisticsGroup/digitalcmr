import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../../services/authentication.service';
import {TransportOrder} from '../../../../../interfaces/transportOrder.interface';
import {TransportOrderService} from '../../../../../services/transportorder.service';

@Component({
  selector:    'app-cancel-modal',
  templateUrl: './cancel-modal.component.html',
  styleUrls:   ['./cancel-modal.component.scss']
})

export class CancelModalComponent implements OnInit {
  @Input() transportOrder: TransportOrder;

  public constructor(private authenticationService: AuthenticationService,
                     private transportOrderService: TransportOrderService) {
  }

  public ngOnInit(): void {
  }

  public open(transportOrder: TransportOrder): void {
    this.transportOrder = transportOrder;
    $('#cancel_modal.ui.modal').modal('show');
    $('#cancel_modal.ui.modal').parent().css({'background-color': 'rgba(0,0,0,0.7)'});
  }

  public close(): void {
    $('#cancel_modal.ui.modal').modal('hide');
  }

  public onSubmit(): void {
    $('#submitButton').addClass('basic loading');

    const transportOrderCancelled = {
      'orderID':      this.transportOrder.orderID,
      'cancellation': {
        'cancelledBy': 'pete@koopman.org',
        'date':        new Date().getTime(),
        'reason':      'a lot of reasons'
      }
    };

    this.transportOrderService.cancelTransportOrder(transportOrderCancelled).subscribe(result => {
      $('#cancel_modal.ui.modal').modal('hide');
      $('#cancel_modal.ui.modal').modal('hide');
      location.reload();
    });
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }
}
