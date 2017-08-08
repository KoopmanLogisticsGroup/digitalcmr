import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public activeUrl: string = '';

  public constructor(private router: Router) {
    router.events.subscribe((url: any) => {
        console.log(url.url);
        this.activeUrl = url.url;
      }
    );
  }
}
