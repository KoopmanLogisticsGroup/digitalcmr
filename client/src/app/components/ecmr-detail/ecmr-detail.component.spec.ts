import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EcmrDetailComponent} from './ecmr-detail.component';

describe('EcmrDetailComponent', () => {
  let component: EcmrDetailComponent;
  let fixture: ComponentFixture<EcmrDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [EcmrDetailComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(EcmrDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
