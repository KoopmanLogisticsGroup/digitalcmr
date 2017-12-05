import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {SearchService} from '../../services/search.service';
import {NavbarService} from '../../services/navbar.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector:    'app-header',
  templateUrl: './header.component.html',
  styleUrls:   ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public queryData: string;
  public user: any;

  public constructor(private searchService: SearchService,
                     private authenticationService: AuthenticationService,
                     public nav: NavbarService) {
    this.searchService.componentCalled$.subscribe(() => {
      this.queryData = '';
    });
  }

  public ngOnInit(): void {
  }

  public sendData(data: Observable<any>): void {
    this.searchService.searchData(data);
  }

  public getUser(): any {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user : null;
  }

  public logout(): void {
    location.reload();
    this.authenticationService.logout();
  }

  public showUserInfo(firstName: string): boolean {
    return this.getUser() && this.getUser().firstName.toLowerCase() === firstName;
  }

  public showLogo(): string {
    if (this.getUser() && this.getUser().username.toLowerCase() === 'lapo@leaseplan.org') {
      return 'logoLeaseplan';
    } else if (this.getUser() && this.getUser().username.toLowerCase() === 'rob@cardealer.org') {
      return 'logoCarDealer';
    }
  }
}
