import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector   : 'app-header',
  templateUrl: './header.component.html',
  styleUrls  : ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public currentView: string;

  public constructor(private router: Router,
                     private _authenticationService: AuthenticationService) {
  }

  public ngOnInit() {
  }

  public getUser() {
    if (this._authenticationService.isAuthenticated()) {
      const user = JSON.parse(localStorage.getItem('currentUser')).user.userID;
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
