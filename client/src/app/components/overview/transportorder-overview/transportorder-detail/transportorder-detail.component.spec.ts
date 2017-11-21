import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TransportorderDetailComponent} from './transportorder-detail.component';

describe('TransportorderDetailComponent', () => {
  let component: TransportorderDetailComponent;
  let fixture: ComponentFixture<TransportorderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [TransportorderDetailComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(TransportorderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
