import { Component, ElementRef, Inject, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
  @ViewChild('attPolicy') attPolicy!: ElementRef;

  step = 1;
  errorMessage = "";
  loginStarts = false;
  signup_token = "";
  username = "";
  validationError = "";
  public isPolcyChecked = false;


  GoToSignIn() {
    this.UserFlowEvent.emit("signin");
  }

  SignUpStart() {

    console.log("SignUpStart started");
    console.log(this.isPolcyChecked)
    if (this.isPolcyChecked == false)
    {
      this.errorMessage = "You must read and agree the Woodgorve policy."
      return;
    }

    this.errorMessage = "";
    this.loginStarts = true;

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('challenge_type', 'redirect oob password');
    formData.append('username', this.attEmail.nativeElement.value);
    formData.append('password', this.attPassword.nativeElement.value);
    formData.append('attributes',
      '{"displayName": "' + this.attDisplayName.nativeElement.value + '", "extension_0cae61cc83e94edd978ec2fde3c5f2f3_PolicyAgreement" : true}');

    this.http.post<any>(environment.baseUrl + '/signup/v1.0/start', formData).subscribe(result => {

      console.log(result);

    }, errorResponse => {

      console.log(errorResponse);

      if (errorResponse.error.error === "verification_required") {
        // Call the challenge endpoint 
        this.SignUpChallenge(errorResponse.error.signup_token);
      }
      else {
        // Error handling
        this.loginStarts = false;
        this.errorMessage = this.GetErrorMessage(errorResponse.error);
      }

    });
  }

  SignUpChallenge(signup_token: string) {

    console.log("SignUpChallenge started");

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('signup_token', signup_token);

    this.http.post<any>(environment.baseUrl + '/signup/v1.0/challenge', formData).subscribe(result => {

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
    console.log("SignUpVerifyOOB started");

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('grant_type', 'oob');
    formData.append('signup_token', this.signup_token);
    formData.append('oob', this.attOTP.nativeElement.value);

    this.http.post<any>(environment.baseUrl + '/signup/v1.0/continue', formData).subscribe(result => {

      console.log(result);

      this.SignUpToken(result.signin_slt);

    }, errorResponse => {

      console.log(errorResponse);

      // Error handling
      this.loginStarts = false;
      this.errorMessage = this.GetErrorMessage(errorResponse.error);

    });
  }

  SignUpToken(signin_slt: string) {

    console.log("SignUpToken started");

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('grant_type', 'slt');
    formData.append('signin_slt', signin_slt);
    formData.append('username', this.username);
    formData.append('scope', environment.scopes);

    this.http.post<any>(environment.baseUrl + '/oauth2/v2.0/token', formData).subscribe(result => {

      console.log(result);

      localStorage.setItem("accessToken", result.access_token);
      this.RetrieveDisplayName();

    }, errorResponse => {

      console.log(errorResponse);

      // Error handling
      this.loginStarts = false;
      this.errorMessage = this.GetErrorMessage(errorResponse.error)
    }
    );
  }

  RetrieveDisplayName() {

    console.log("RetrieveDisplayName started");

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

    }, errorResponse => {

      console.log(errorResponse);

      // Error handling
      this.loginStarts = false;
      this.errorMessage = this.GetErrorMessage(errorResponse.error)
    });
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
