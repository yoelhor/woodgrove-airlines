import { Component, ElementRef, Inject, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-sign-in-with-pwd',
  templateUrl: './sign-in-with-pwd.component.html',
  styleUrls: ['./sign-in-with-pwd.component.css']
})
export class SignInWithPwdComponent {
  constructor(private http: HttpClient) {

  }

  // Sharing data between child and parent components events
  @Output() displayNameEvent = new EventEmitter<string>();
  @Output() OverlayVisibilityEvent = new EventEmitter<boolean>();
  @Output() LoginButtonVisibilityEvent = new EventEmitter<boolean>();
  @Output() UserFlowEvent = new EventEmitter<string>();
  @Output() AuthMethodEvent = new EventEmitter<string>();

  @ViewChild('signInEmail') signInEmail!: ElementRef;
  @ViewChild('signInPassword') signInPassword!: ElementRef;

  errorMessage = "";
  loginStarts = false;
  showSignUpLink = false;
  showOtpLink = false;


  GoToSSPR() {
    this.UserFlowEvent.emit("sspr");
  }

  GoToSignUp() {
    this.UserFlowEvent.emit("signup");
  }

  GoToOTP() {
    this.AuthMethodEvent.emit("otp");
  }

  PasswordLogin_1_Initiate() {

    console.log("PasswordLogin_1_Initiate started");

    this.errorMessage = "";
    this.loginStarts = true;
    this.showSignUpLink = false;
    this.showOtpLink = false;

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('challenge_type', 'password redirect');
    formData.append('username', this.signInEmail.nativeElement.value);

    this.http.post<any>(environment.baseUrl + '/oauth2/v2.0/initiate', formData).subscribe(result => {

      console.log("Result from PasswordLogin_1_Initiate result:");
      console.log(result);

      if (result.challenge_type == "redirect") {
        this.errorMessage = "You cannot sign-in with your email and password.";
        this.showOtpLink = true;
        this.loginStarts = false;
      }
      else {
        // Call the challenge endpoint 
        this.PasswordLogin_2_Challenge(result.credential_token);

      }

    }, response => {
      console.log("Result from PasswordLogin_1_Initiate error:");
      console.log(response.error);

      // Error handling
      if (response.error.error_description.includes("AADSTS50034")) {
        this.errorMessage = "We couldn't find an account with this email address.";
        this.showSignUpLink = true;
      }
      else {
        this.loginStarts = false;
        this.errorMessage = this.GetErrorMessage(response.error);
      }

      this.loginStarts = false;
      this.loginStarts = false;
    });
  }


  PasswordLogin_2_Challenge(credential_token: string) {

    console.log("PasswordLogin_2_Challenge started");

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('challenge_type', 'password redirect');
    formData.append('credential_token', credential_token);

    this.http.post<any>(environment.baseUrl + '/oauth2/v2.0/challenge', formData).subscribe(result => {

      console.log(result);

      if (result.error) {
        // Error handling
        this.loginStarts = false;
        this.errorMessage = result.error_description;
      }
      else {
        this.PasswordLogin_3_Token(result.credential_token);
      }
    }, error => {
      console.error(error);
      this.errorMessage = error.message;
      this.loginStarts = false;
    });
  }

  PasswordLogin_3_Token(credential_token: string) {

    console.log("PasswordLogin_3_Token started");

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('grant_type', 'password');
    formData.append('password', this.signInPassword.nativeElement.value);
    formData.append('credential_token', credential_token);
    formData.append('scope', environment.scopes);

    this.http.post<any>(environment.baseUrl + '/oauth2/v2.0/token', formData).subscribe(result => {

      console.log(result);

      // Can be replaced with sessionStorage
      if (!result.error) {
        // Can be replaced with sessionStorage
        localStorage.setItem("accessToken", result.access_token);
        this.RetrieveDisplayName();
      }
      else {
        this.loginStarts = false;
        if (result.error_description.includes("AADSTS50126") || result.error_description.includes("AADSTS9002313")) {
          this.errorMessage = "We couldn't find an account with this email address or password.";
        }
        else {
          this.errorMessage = result.error_description;
        }

      }

    }, error => {
      console.error(error);
      this.errorMessage = error.message;
      this.loginStarts = false;
    });
  }

  RetrieveDisplayName() {

    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    });

    const requestOptions = { headers: headers };

    const formData = new FormData();
    formData.append('accessToken', `${localStorage.getItem('accessToken')}`);

    this.http.post<any>(environment.appUrl + "profile", formData /*, { headers: headers }**/).subscribe(result => {
      console.log("Result from RetrieveDisplayName:");
      console.log(result);

      // Update the parent component
      this.displayNameEvent.emit(result.name);
      this.OverlayVisibilityEvent.emit(false);
      this.LoginButtonVisibilityEvent.emit(false);

      this.loginStarts = false;

    }, error => console.error(error));
  }

  closeOverlay() {
    this.OverlayVisibilityEvent.emit(false);
    this.LoginButtonVisibilityEvent.emit(true);
  }

  GetErrorMessage(error: any) {
    if (error.error_description) {
      let i = error.error_description.indexOf("Trace");

      if (i > 0) {
        return error.error_description.substring(0, i - 1)
      }
    }

    return error.message;
  }
}
