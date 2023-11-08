import { Component, ElementRef, Inject, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-sign-up-with-pwd',
  templateUrl: './sign-up-with-pwd.component.html',
  styleUrls: ['./sign-up-with-pwd.component.css']
})

export class SignUpWithPwdComponent {
  constructor(private http: HttpClient) {

  }

  // Sharing data between child and parent components events
  @Output() displayNameEvent = new EventEmitter<string>();
  @Output() OverlayVisibilityEvent = new EventEmitter<boolean>();
  @Output() LoginButtonVisibilityEvent = new EventEmitter<boolean>();
  @Output() UserFlowEvent = new EventEmitter<string>();

  @ViewChild('attEmail') attEmail!: ElementRef;
  @ViewChild('attDisplayName') attDisplayName!: ElementRef;
  @ViewChild('attPassword') attPassword!: ElementRef;
  @ViewChild('attOTP') attOTP!: ElementRef;

  step = 1;
  errorMessage = "";
  loginStarts = false;
  signup_token = "";
  username = "";


  GoToSignIn() {
    this.UserFlowEvent.emit("signin");
  }

  SignUpStart() {

    this.errorMessage = "";
    this.loginStarts = true;

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('challenge_type', 'redirect oob password');
    formData.append('username', this.attEmail.nativeElement.value);
    formData.append('password', this.attPassword.nativeElement.value);
    formData.append('attributes', '{"displayName": "' + this.attDisplayName.nativeElement.value + '"}');

    this.http.post<any>(environment.baseUrl + '/signup/v1.0/start', formData).subscribe(result => {

      console.log("Result from SignUpStart:");
      console.log(result);

      if (result.error) {

        if (result.error != "verification_required") {
          // Error handling
          this.loginStarts = false;
          this.errorMessage = result.error_description;
        }
        else {
          // Call the challenge endpoint 
          this.SignUpChallenge(result.signup_token);
        }
      }
    }, error => console.error(error));
  }

  SignUpChallenge(signup_token: string) {

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('signup_token', signup_token);

    this.http.post<any>(environment.baseUrl + '/signup/v1.0/challenge', formData).subscribe(result => {
      console.log("Result from SignUpChallenge:");
      console.log(result);

      if (result.error) {
        // Error handling
        this.loginStarts = false;
        this.errorMessage = result.error_description;
      }
      else {
        this.step = 2;
        this.loginStarts = false;
        // Pass the sign-up token to the next step
        this.signup_token = result.signup_token;
        this.username = this.attEmail.nativeElement.value
      }
    }, error => console.error(error));
  }


  SignUpVerifyOOB() {

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('grant_type', 'oob');
    formData.append('signup_token', this.signup_token);
    formData.append('oob', this.attOTP.nativeElement.value);

    this.http.post<any>(environment.baseUrl + '/signup/v1.0/continue', formData).subscribe(result => {
      console.log("Result from SignUpVerifyOOB:");
      console.log(result);

      if (result.error) {
        // Error handling
        this.loginStarts = false;
        this.errorMessage = result.error_description;
      }
      else {
        this.SignUpToken(result.signin_slt)
      }

    }, error => console.error(error));
  }

  SignUpToken(signin_slt: string) {

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('grant_type', 'slt');
    formData.append('signin_slt', signin_slt);
    formData.append('username', this.username);
    formData.append('scope', environment.scopes);

    this.http.post<any>(environment.baseUrl + '/oauth2/v2.0/token', formData).subscribe(result => {
      console.log("Result from SignUpToken:");
      console.log(result);

      // Can be replaced with sessionStorage
      if (result.error) {
        // Error handling
        this.loginStarts = false;
        this.errorMessage = result.error_description;
      }
      else {
        localStorage.setItem("accessToken", result.access_token);
        this.RetrieveDisplayName();
      }

    }, error => console.error(error));
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
}
