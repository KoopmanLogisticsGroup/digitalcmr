import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EcmrOverviewComponent} from './ecmr-overview.component';

describe('EcmrOverviewComponent', () => {
  let component: EcmrOverviewComponent;
  let fixture: ComponentFixture<EcmrOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [EcmrOverviewComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(EcmrOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
