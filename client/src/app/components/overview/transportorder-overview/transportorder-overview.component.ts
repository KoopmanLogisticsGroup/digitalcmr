import {Component, Input, OnInit} from '@angular/core';
import {NavbarService} from '../../../services/navbar.service';
import {SearchService} from '../../../services/search.service';
import {TransportOrderService} from '../../../services/transportorder.service';
import {TransportOrder} from '../../../interfaces/transportOrder.interface';
import {Ecmr} from '../../../interfaces/ecmr.interface';

@Component({
  selector:    'app-transportorder-overview',
  templateUrl: './transportorder-overview.component.html',
  styleUrls:   ['./transportorder-overview.component.scss']
})
export class TransportorderOverviewComponent implements OnInit {
  @Input() public transportOrder: TransportOrder;
  @Input() public ecmr: Ecmr;

  public currentView: string;
  public searchBarData: string;
  public filterEcmr: number;
  public transportOrders: TransportOrder[];
  public transportOrderFilter: TransportOrder[];
  public TransportOrderStatus = {
    Open:       'OPEN',
    InProgress: 'IN_PROGRESS',
    Completed:  'COMPLETED',
  };

  public User = {
    CompoundAdmin:   'CompoundAdmin',
    CarrierMember:   'CarrierMember',
    RecipientMember: 'RecipientMember',
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };

  public viewStatus = {
    Open:       'OPEN',
    New:        'NEW',
    InProgress: 'IN_PROGRESS',
    Completed:  'COMPLETED'
  };

  public constructor(private transportOrderService: TransportOrderService,
                     private searchService: SearchService,
                     public nav: NavbarService) {
    this.searchService.searchData$.subscribe((data: string) => {
      this.searchBarData = data;
    });
    this.searchService.filterEcmr$.subscribe((data: number) => {
      this.filterEcmr = data;
    });
    this.currentView   = this.viewStatus.Open;
    this.searchBarData = '';
  }

  ngOnInit() {
    this.nav.show();
    this.transportOrderService.getAllTransportOrders().subscribe(transportOrders => {
      if (transportOrders instanceof Array === true) {
        this.transportOrders      = transportOrders instanceof Array ? transportOrders : [];
        this.transportOrderFilter = this.transportOrders.filter(transportOrder =>
          transportOrder.status.toUpperCase() === this.viewStatus.New);
        this.firstView();
      } else {
        this.transportOrders = [];
        this.transportOrders.push(transportOrders);
        this.transportOrderFilter = this.transportOrders.filter(transportOrder =>
          transportOrder.status.toUpperCase() === this.viewStatus.New);
        this.firstView();
      }
    });
  }

  private firstView(): void {
    this.currentView          = this.viewStatus.New;
    this.transportOrderFilter = this.transportOrders.filter(transportOrder => {
      if (this.currentView === this.viewStatus.New && transportOrder.status === this.TransportOrderStatus.Open) {
        return transportOrder;
      }
    });
  }

  public setTransportOrderView(view: string): void {
    this.currentView          = view;
    this.transportOrderFilter = this.transportOrders.filter(transportOrder => {
      if (this.currentView === this.viewStatus.New && transportOrder.status === this.TransportOrderStatus.Open) {
        return transportOrder;
      } else if (this.currentView === this.viewStatus.InProgress && (transportOrder.status === this.TransportOrderStatus.InProgress)) {
        return transportOrder;
      } else if (this.currentView === this.viewStatus.Completed && (transportOrder.status === this.TransportOrderStatus.Completed)) {
        return transportOrder;
      }
    });
  }
}
