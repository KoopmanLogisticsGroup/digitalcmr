import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector:    'app-header',
  templateUrl: './header.component.html',
  styleUrls:   ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public role: string;
  public currentView: string;

  public constructor(private router: Router) {
  }

  public ngOnInit() {
  }

  public getUser() {
    return 'Harry';
  }

  public setOverview(): void {
    this.currentView = 'overview';
  }

  public setDetails(): void {
    this.currentView = 'details';
  }

}
