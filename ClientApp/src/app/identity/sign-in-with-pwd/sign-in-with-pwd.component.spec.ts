import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInWithPwdComponent } from './sign-in-with-pwd.component';

describe('SignInWithPwdComponent', () => {
  let component: SignInWithPwdComponent;
  let fixture: ComponentFixture<SignInWithPwdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignInWithPwdComponent]
    });
    fixture = TestBed.createComponent(SignInWithPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
