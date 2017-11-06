import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TransportOrder} from '../../interfaces/transportOrder.interface';
import {TransportOrderService} from '../../services/transportorder.service';

@Component({
  selector:    'app-transportorder-detail',
  templateUrl: './transportorder-detail.component.html',
  styleUrls:   ['./transportorder-detail.component.scss']
})
export class TransportorderDetailComponent implements OnInit {

  private orderID: string;
  public transportOrder: TransportOrder;

  constructor(private route: ActivatedRoute,
              private transportOrderService: TransportOrderService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.orderID = params['orderID'];
        this.transportOrderService.getTransportOrderByOrderID(this.orderID).subscribe((transportOrder: TransportOrder) => {
          this.transportOrder = transportOrder;
        });
      });
  }
}
