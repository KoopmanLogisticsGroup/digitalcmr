import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector:    'app-login',
  templateUrl: './login.component.html',
  styleUrls:   ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public loading: boolean;
  public error: boolean;

  public constructor(private router: Router,
                     private authenticationService: AuthenticationService) {
    this.username = '';
    this.password = '';
    this.loading  = false;
    this.error    = false;
  }

  public ngOnInit(): void {
    this.authenticationService.logout();
  }

  public login(username: string, password: string): void {
    this.authenticationService.login(username, password)
      .subscribe(result => {
        if (result) {
          this.error = false;
          this.router.navigate(['./overview']);
        } else {
          this.error = true;
        }
      });
  }

  public cleanError(): void {
    this.error = false;
  }
}
