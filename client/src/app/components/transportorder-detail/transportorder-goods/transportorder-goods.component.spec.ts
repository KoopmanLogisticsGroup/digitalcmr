import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TransportorderGoodsComponent} from './transportorder-goods.component';

describe('TransportorderGoodsComponent', () => {
  let component: TransportorderGoodsComponent;
  let fixture: ComponentFixture<TransportorderGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [TransportorderGoodsComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(TransportorderGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
