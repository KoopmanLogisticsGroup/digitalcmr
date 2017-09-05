import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {SearchService} from '../../../services/search.service';
import {NavbarService} from '../../../services/navbar.service';

@Component({
  selector   : 'app-header',
  templateUrl: './header.component.html',
  styleUrls  : ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public currentView: string;

  public constructor(private searchService: SearchService,
                     private _authenticationService: AuthenticationService,
                     public nav: NavbarService) {
  }

  public ngOnInit() {
  }

  public sendData(data: any) {
    this.searchService.searchData(data);
  }

  public getUser() {
    if (this._authenticationService.isAuthenticated()) {
      const user = JSON.parse(localStorage.getItem('currentUser')).user.username;
      return user;
    }
    return null;
  }

  public logout() {
    location.reload();
    this._authenticationService.logout();
  }

  public setOverview(): void {
    this.currentView = 'overview';
  }
}
