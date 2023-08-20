import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInWithOtpComponent } from './sign-in-with-otp.component';

describe('SignInWithOtpComponent', () => {
  let component: SignInWithOtpComponent;
  let fixture: ComponentFixture<SignInWithOtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignInWithOtpComponent]
    });
    fixture = TestBed.createComponent(SignInWithOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
