import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpWithPwdComponent } from './sign-up-with-pwd.component';

describe('SignUpWithPwdComponent', () => {
  let component: SignUpWithPwdComponent;
  let fixture: ComponentFixture<SignUpWithPwdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpWithPwdComponent]
    });
    fixture = TestBed.createComponent(SignUpWithPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
