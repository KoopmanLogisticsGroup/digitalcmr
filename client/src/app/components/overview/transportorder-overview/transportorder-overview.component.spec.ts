import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TransportorderOverviewComponent} from './transportorder-overview.component';

describe('TransportorderOverviewComponent', () => {
  let component: TransportorderOverviewComponent;
  let fixture: ComponentFixture<TransportorderOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [TransportorderOverviewComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(TransportorderOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
