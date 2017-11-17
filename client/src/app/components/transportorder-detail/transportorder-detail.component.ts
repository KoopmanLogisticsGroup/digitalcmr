import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TransportOrder} from '../../interfaces/transportOrder.interface';
import {TransportOrderService} from '../../services/transportorder.service';
import {EcmrService} from '../../services/ecmr.service';
import {Ecmr} from '../../interfaces/ecmr.interface';

@Component({
  selector:    'app-transportorder-detail',
  templateUrl: './transportorder-detail.component.html',
  styleUrls:   ['./transportorder-detail.component.scss']
})
export class TransportorderDetailComponent implements OnInit {

  private orderID: string;
  public transportOrder: TransportOrder;
  public ecmrs: Ecmr[];

  public constructor(private route: ActivatedRoute,
                     private transportOrderService: TransportOrderService,
                     private ecmrService: EcmrService) {
  }

  public ngOnInit(): void {
    this.orderID = this.route.snapshot.paramMap.get('orderID');
    this.transportOrderService.getTransportOrderByOrderID(this.orderID)
      .subscribe((transportOrder: TransportOrder) => {
        this.transportOrder = transportOrder;
        this.ecmrService.getEcmrsByTransportOrderID(this.orderID)
          .subscribe((ecmrs: Ecmr[]) => {
            if (ecmrs instanceof Array) {
              this.ecmrs = ecmrs;
            } else {
              this.ecmrs = [];
              this.ecmrs.push(ecmrs);
            }
          });
      });
  }
}
