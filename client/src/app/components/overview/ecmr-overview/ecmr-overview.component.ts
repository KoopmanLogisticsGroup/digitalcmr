import {Component, Input, OnInit} from '@angular/core';
import {EcmrService} from '../../../services/ecmr.service';
import {Ecmr} from '../../../interfaces/ecmr.interface';
import {AuthenticationService} from '../../../services/authentication.service';
import {NavbarService} from '../../../services/navbar.service';
import {SearchService} from '../../../services/search.service';

@Component({
  selector:    'app-ecmr-overview',
  templateUrl: './ecmr-overview.component.html',
  styleUrls:   ['./ecmr-overview.component.scss']
})
export class EcmrOverviewComponent implements OnInit {
  @Input() public ecmr: Ecmr;
  private ecmrs: Ecmr[];

  public currentView: string;
  public searchBarData: string;
  public filterEcmr: number;
  public ecmrsFiltered: Ecmr[];

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

  public viewStatus = {
    Open:       'OPEN',
    New:        'NEW',
    InProgress: 'IN_PROGRESS',
    Completed:  'COMPLETED'
  };

  public constructor(private ecmrService: EcmrService,
                     private authenticationService: AuthenticationService,
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

  public ngOnInit(): void {
    this.nav.show();
    this.ecmrService.getAllEcmrs().subscribe(response => {
      this.ecmrs         = response instanceof Array ? response : [];
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => ecmr.status.toUpperCase() === this.EcmrStatus.Created);
      this.firstView();
    });
  }

  private firstView(): void {
    if (this.getUserRole() === 'amsterdamcompound') {
      this.currentView = this.viewStatus.Open;
    } else if (this.getUserRole() === this.User.CarrierMember || this.getUserRole() === this.User.RecipientMember) {
      this.currentView   = this.viewStatus.InProgress;
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
        if (this.currentView === this.viewStatus.InProgress && (ecmr.status === this.EcmrStatus.Loaded
            || ecmr.status === this.EcmrStatus.InTransit)) {
          return ecmr;
        }
      });
    } else if (this.getUserRole() === this.User.LegalOwnerAdmin) {
      this.currentView   = this.viewStatus.Completed;
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
        if (this.currentView === this.viewStatus.Completed && (ecmr.status === this.EcmrStatus.Delivered ||
            ecmr.status === this.EcmrStatus.ConfirmedDelivered)) {
          return ecmr;
        }
      });
    }
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }

  public setCurrentView(view: string): void {
    this.currentView   = view;
    this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
      if ((this.currentView === this.viewStatus.Open && ecmr.status === this.EcmrStatus.Created) ||
        (this.currentView === this.viewStatus.InProgress && (ecmr.status === this.EcmrStatus.Loaded ||
          ecmr.status === this.EcmrStatus.InTransit) ||
          (this.currentView === this.viewStatus.Completed && (ecmr.status === this.EcmrStatus.Delivered ||
            ecmr.status === this.EcmrStatus.ConfirmedDelivered)))) {
        return ecmr;
      }
    });
  }

  public hasComments(ecmr: Ecmr): boolean {
    return ecmr && ecmr.goods.filter(good => {
      if ((good.compoundRemark && good.compoundRemark.comments) ||
        (good.carrierLoadingRemark && good.carrierLoadingRemark.comments) ||
        (good.carrierDeliveryRemark && good.carrierDeliveryRemark.comments) ||
        (good.recipientRemark && good.recipientRemark.comments)) {
        return good;
      }
    }).length > 0;
  }

  public isDamaged(ecmr: Ecmr): boolean {
    return ecmr && ecmr.goods.filter(good => {
      if ((good.compoundRemark && good.compoundRemark.isDamaged) ||
        (good.carrierLoadingRemark && good.carrierLoadingRemark.isDamaged) ||
        (good.carrierDeliveryRemark && good.carrierDeliveryRemark.isDamaged) ||
        (good.recipientRemark && good.recipientRemark.isDamaged)) {
        return good;
      }
    }).length > 0;
  }

  public clearSearchBar(): void {
    this.searchBarData = '';
  }

  public returnStatus(ecmr: any): string {
    if (ecmr && ecmr.status === this.EcmrStatus.Created) {
      return 'open_status';
    } else if (ecmr && ecmr.status === this.EcmrStatus.Loaded) {
      return 'awaiting_status';
    } else if (ecmr && ecmr.status === this.EcmrStatus.InTransit) {
      return 'transit_status';
    } else if (ecmr && ecmr.status === this.EcmrStatus.Delivered) {
      return 'completed_status';
    } else if (ecmr && ecmr.status === this.EcmrStatus.ConfirmedDelivered) {
      return 'confirmed_status';
    }
  }
}
