import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SignOffModalComponent} from './cancel-modal.component';

describe('SignOffModalComponent', () => {
  let component: SignOffModalComponent;
  let fixture: ComponentFixture<SignOffModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [SignOffModalComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(SignOffModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
