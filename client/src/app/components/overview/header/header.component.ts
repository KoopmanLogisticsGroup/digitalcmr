import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {SearchService} from '../../../services/search.service';
import {NavbarService} from '../../../services/navbar.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector:    'app-header',
  templateUrl: './header.component.html',
  styleUrls:   ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public queryData: string;

  public constructor(private searchService: SearchService,
                     private authenticationService: AuthenticationService,
                     public nav: NavbarService) {
  }

  public ngOnInit(): void {
  }

  public sendData(data: Observable<any>): void {
    this.searchService.searchData(data);
  }

  public getUser(): any {
    if (this.authenticationService.isAuthenticated()) {
      return JSON.parse(localStorage.getItem('currentUser')).user;
    }
    return null;
  }

  public logout(): void {
    location.reload();
    this.authenticationService.logout();
  }

  public showUserInfo(firstname): boolean {
    return this.getUser().firstName.toLowerCase() === firstname;
  }

  public showLogo(): string {
    if (this.getUser().username.toLowerCase() === 'lapo@leaseplan.org') {
      return 'logoLeaseplan';
    } else if (this.getUser().username.toLowerCase() === 'rob@cardealer.org') {
      return 'logoCarDealer';
    }
  }
}
