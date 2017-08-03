import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmrsComponent } from './ecmrs.component';

describe('EcmrsComponent', () => {
  let component: EcmrsComponent;
  let fixture: ComponentFixture<EcmrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcmrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcmrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
