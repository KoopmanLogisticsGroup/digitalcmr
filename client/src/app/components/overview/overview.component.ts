import {Component, Input, OnInit} from '@angular/core';
import {EcmrService} from '../../services/ecmr.service';
import {AuthenticationService} from '../../services/authentication.service';
import {SearchService} from '../../services/search.service';
import {NavbarService} from '../../services/navbar.service';
import {Ecmr} from '../../interfaces/ecmr.interface';

@Component({
  selector:    'app-overview',
  templateUrl: './overview.component.html',
  styleUrls:   ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  @Input() public ecmr: Ecmr;

  public currentView: string;
  public searchBarData: string;
  public filterEcmr: number;
  private ecmrs: Ecmr[];
  public ecmrsFiltered: Ecmr[];
  public EcmrStatus = {
    CREATED:             'CREATED',
    LOADED:              'LOADED',
    IN_TRANSIT:          'IN_TRANSIT',
    DELIVERED:           'DELIVERED',
    CONFIRMED_DELIVERED: 'CONFIRMED_DELIVERED'
  };

  public User = {
    CompoundAdmin:   'CompoundAdmin',
    CarrierMember:   'CarrierMember',
    RecipientMember: 'RecipientMember',
    LegalOwnerAdmin: 'LegalOwnerAdmin'
  };

  public viewStatus = {
    OPEN:        'Open',
    IN_PROGRESS: 'InProgress',
    COMPLETED:   'Completed'
  };

  public constructor(private ecmrService: EcmrService,
                     private searchService: SearchService,
                     private authenticationService: AuthenticationService,
                     public nav: NavbarService) {
    this.searchService.searchData$.subscribe((data: string) => {
      this.searchBarData = data;
    });
    this.searchService.filterEcmr$.subscribe((data: number) => {
      this.filterEcmr = data;
    });
    this.currentView   = this.viewStatus.OPEN;
    this.searchBarData = '';
  }

  public ngOnInit(): void {
    this.nav.show();
    this.ecmrService.getAllEcmrs().subscribe(response => {
      this.ecmrs         = response instanceof Array ? response : [];
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => ecmr.status.toUpperCase() === this.EcmrStatus.CREATED);
      this.firstView();
    });
  }

  private firstView(): void {
    if (this.getUserRole() === 'amsterdamcompound') {
      this.currentView = this.viewStatus.OPEN;
    } else if (this.getUserRole() === this.User.CarrierMember || this.getUserRole() === this.User.RecipientMember) {
      this.currentView   = this.viewStatus.IN_PROGRESS;
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
        if (this.currentView === this.viewStatus.IN_PROGRESS && (ecmr.status === this.EcmrStatus.LOADED
            || ecmr.status === this.EcmrStatus.IN_TRANSIT)) {
          return ecmr;
        }
      });
    } else if (this.getUserRole() === this.User.LegalOwnerAdmin) {
      this.currentView   = this.viewStatus.COMPLETED;
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
        if (this.currentView === this.viewStatus.COMPLETED && (ecmr.status === this.EcmrStatus.DELIVERED ||
            ecmr.status === this.EcmrStatus.CONFIRMED_DELIVERED)) {
          return ecmr;
        }
      });
    }
  }

  public setCurrentView(view: string): void {
    this.currentView   = view;
    this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
      if (this.currentView === this.viewStatus.OPEN && ecmr.status === this.EcmrStatus.CREATED) {
        return ecmr;
      } else if (this.currentView === this.viewStatus.IN_PROGRESS && (ecmr.status === this.EcmrStatus.LOADED ||
          ecmr.status === this.EcmrStatus.IN_TRANSIT)) {
        return ecmr;
      } else if (this.currentView === this.viewStatus.COMPLETED && (ecmr.status === this.EcmrStatus.DELIVERED ||
          ecmr.status === this.EcmrStatus.CONFIRMED_DELIVERED)) {
        return ecmr;
      }
    });
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
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
    if (ecmr && ecmr.status === this.EcmrStatus.CREATED) {
      return 'open-status';
    } else if (ecmr && ecmr.status === this.EcmrStatus.LOADED) {
      return 'awaiting-status';
    } else if (ecmr && ecmr.status === this.EcmrStatus.IN_TRANSIT) {
      return 'transit-status';
    } else if (ecmr && ecmr.status === this.EcmrStatus.DELIVERED) {
      return 'completed-status';
    } else if (ecmr && ecmr.status === this.EcmrStatus.CONFIRMED_DELIVERED) {
      return 'confirmed-status';
    }
  }
}
