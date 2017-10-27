import {Component, Input, OnInit} from '@angular/core';
import {EcmrService} from '../../services/ecmr.service';
import {AuthenticationService} from '../../services/authentication.service';
import {SearchService} from '../../services/search.service';
import {NavbarService} from '../../services/navbar.service';
import {EcmrInterface} from '../../interfaces/ecmr.interface';

@Component({
  selector:    'app-overview',
  templateUrl: './overview.component.html',
  styleUrls:   ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  @Input() public ecmr: EcmrInterface;

  public currentView: string;
  public searchBarData: string;
  public filterEcmr: number;
  private ecmrs: EcmrInterface[];
  public ecmrsFiltered: EcmrInterface[];

  public constructor(private ecmrService: EcmrService,
                     private searchService: SearchService,
                     private _authenticationService: AuthenticationService,
                     public nav: NavbarService) {
    // this.filterEcmr = 0;
    this.searchService.searchData$.subscribe((data: string) => {
      this.searchBarData = data;
    });
    this.searchService.filterEcmr$.subscribe((data: number) => {
      this.filterEcmr = data;
    });
    this.currentView = 'OPEN';
    this.searchBarData = '';
  }

  public ngOnInit(): void {
    this.nav.show();
    this.ecmrService.getAllEcmrs().subscribe(response => {
      this.ecmrs         = response instanceof Array ? response : [];
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => ecmr.status.toUpperCase() === 'CREATED');
      this.firstView();
    });
  }

  private firstView(): void {
    if (this.userRole() === 'amsterdamcompound') {
      this.currentView = 'OPEN';
    } else if (this.userRole() === 'CarrierMember' || this.userRole() === 'RecipientMember') {
      this.currentView   = 'IN_PROGRESS';
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
        if (this.currentView === 'IN_PROGRESS' && (ecmr.status === 'LOADED' || ecmr.status === 'IN_TRANSIT')) {
          return ecmr;
        }
      });
    } else if (this.userRole() === 'LegalOwnerAdmin') {
      this.currentView   = 'COMPLETED';
      this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
        if (this.currentView === 'COMPLETED' && (ecmr.status === 'DELIVERED' || ecmr.status === 'CONFIRMED_DELIVERED')) {
          return ecmr;
        }
      });
    }
  }

  public setCurrentView(view: string): void {
    this.currentView   = view;
    this.ecmrsFiltered = this.ecmrs.filter(ecmr => {
      if (this.currentView === 'OPEN' && ecmr.status === 'CREATED') {
        return ecmr;
      } else if (this.currentView === 'IN_PROGRESS' && (ecmr.status === 'LOADED' || ecmr.status === 'IN_TRANSIT')) {
        return ecmr;
      } else if (this.currentView === 'COMPLETED' && (ecmr.status === 'DELIVERED' || ecmr.status === 'CONFIRMED_DELIVERED')) {
        return ecmr;
      }
    });
  }

  public userRole(): string {
    if (this._authenticationService.isAuthenticated()) {
      const userRole: string  = JSON.parse(localStorage.getItem('currentUser')).user.role;
      return userRole;
    }
    return null;
  }

  public hasComments(ecmr: EcmrInterface): boolean {
    return ecmr && ecmr.goods.filter(good => {
      if ((good.compoundRemark && good.compoundRemark.comments) ||
        (good.carrierLoadingRemark && good.carrierLoadingRemark.comments) ||
        (good.carrierDeliveryRemark && good.carrierDeliveryRemark.comments) ||
        (good.recipientRemark && good.recipientRemark.comments)) {
        return good;
      }
    }).length > 0;
  }

  public isDamaged(ecmr: EcmrInterface): boolean {
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
}
