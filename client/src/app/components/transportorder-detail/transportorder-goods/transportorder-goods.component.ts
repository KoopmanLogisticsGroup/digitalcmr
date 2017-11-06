import {Component, Input, OnInit} from '@angular/core';
import {TransportOrder} from '../../../interfaces/transportOrder.interface';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector:    'app-transportorder-goods',
  templateUrl: './transportorder-goods.component.html',
  styleUrls:   ['./transportorder-goods.component.scss']
})
export class TransportorderGoodsComponent implements OnInit {
  @Input() public transportOrder: TransportOrder;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  public getUserRole(): string {
    return this.authenticationService.isAuthenticated() ? JSON.parse(localStorage.getItem('currentUser')).user.role : '';
  }
}
