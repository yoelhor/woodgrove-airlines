import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpWithOtpComponent } from './sign-up-with-otp.component';

describe('SignUpWithOtpComponent', () => {
  let component: SignUpWithOtpComponent;
  let fixture: ComponentFixture<SignUpWithOtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpWithOtpComponent]
    });
    fixture = TestBed.createComponent(SignUpWithOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
