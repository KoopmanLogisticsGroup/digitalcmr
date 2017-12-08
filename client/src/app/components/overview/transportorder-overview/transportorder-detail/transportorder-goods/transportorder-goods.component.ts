import {Component, Input, OnInit} from '@angular/core';
import {TransportOrder} from '../../../../../interfaces/transportOrder.interface';
import {Ecmr} from '../../../../../interfaces/ecmr.interface';
import {Signature} from '../../../../../interfaces/signature.interface';
import {DateWindow} from '../../../../../interfaces/dateWindow.interface';

@Component({
  selector:    'app-transportorder-goods',
  templateUrl: './transportorder-goods.component.html',
  styleUrls:   ['./transportorder-goods.component.scss']
})
export class TransportorderGoodsComponent implements OnInit {
  @Input() public transportOrder: TransportOrder;
  @Input() public ecmrs: Ecmr[];
  public test: string;

  public ngOnInit(): void {
    $('.ui.accordion')
      .accordion();

    $('.noStatus').text('blaat');
  }

  public selectECMR(vin) {
    let ecmrID = '';

    if (this.ecmrs) {
      for (const ecmr of this.ecmrs) {
        for (const good of ecmr.goods) {
          if (good.vehicle.vin === vin) {
            ecmrID = ecmr.ecmrID;
          }
        }
      }
    }
    return '/ecmr/' + ecmrID;
  }

  public signatureInTime(dateWindow: DateWindow, signature: Signature) {
    return (signature.timestamp >= dateWindow.startDate && signature.timestamp <= dateWindow.endDate);
  }
}
