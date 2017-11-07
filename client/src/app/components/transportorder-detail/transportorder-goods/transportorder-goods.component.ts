import {Component, Input, OnInit} from '@angular/core';
import {TransportOrder} from '../../../interfaces/transportOrder.interface';
import {ActivatedRoute} from '@angular/router';
import {TransportOrderService} from '../../../services/transportorder.service';

@Component({
  selector:    'app-transportorder-goods',
  templateUrl: './transportorder-goods.component.html',
  styleUrls:   ['./transportorder-goods.component.scss']
})
export class TransportorderGoodsComponent implements OnInit {
  @Input() public transportOrder: TransportOrder;
  private orderID: string;

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

  public convertToEcmr() {
    // this.transportOrderService.generateECMR(this.transportOrder);
    // todo add modal
    console.log('Nothing happens, yet.')
  }
}
