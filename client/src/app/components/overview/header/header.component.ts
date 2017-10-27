import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {SearchService} from '../../../services/search.service';
import {NavbarService} from '../../../services/navbar.service';

@Component({
  selector:    'app-header',
  templateUrl: './header.component.html',
  styleUrls:   ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public currentView: string;
  public queryData: string;

  public constructor(private searchService: SearchService,
                     private authenticationService: AuthenticationService,
                     public nav: NavbarService) {
  }

  public ngOnInit(): void {
  }

  public sendData(data: {}): void {
    this.searchService.searchData(data);
  }

  public getUser(): string {
    if (this.authenticationService.isAuthenticated()) {
      const user: string = JSON.parse(localStorage.getItem('currentUser')).user.firstName;
      return user;
    }
    return null;
  }

  public logout(): void {
    location.reload();
    this.authenticationService.logout();
  }

  public setOverview(): void {
    this.currentView = 'overview';
  }
}
