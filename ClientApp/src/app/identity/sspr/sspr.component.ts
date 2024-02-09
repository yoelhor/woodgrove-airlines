import { Component, ElementRef, Inject, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Time } from '@angular/common';

@Component({
  selector: 'app-sspr',
  templateUrl: './sspr.component.html',
  styleUrls: ['./sspr.component.css']
})
export class SsprComponent {
  constructor(private http: HttpClient) {

  }

  // Sharing data between child and parent components events
  @Output() displayNameEvent = new EventEmitter<string>();
  @Output() OverlayVisibilityEvent = new EventEmitter<boolean>();
  @Output() LoginButtonVisibilityEvent = new EventEmitter<boolean>();
  @Output() UserFlowEvent = new EventEmitter<string>();

  @ViewChild('attEmail') attEmail!: ElementRef;
  @ViewChild('attPassword') attPassword!: ElementRef;
  @ViewChild('attOTP') attOTP!: ElementRef;

  errorMessage = "";
  step = 1;
  password_reset_token = "";
  showSpinner = false;
  interval: any;

  GoToSignIn() {
    this.UserFlowEvent.emit("signin");
  }

  SSPR_1_Start() {

    console.log("SSPR_1_Start started");

    this.errorMessage = "";
    this.showSpinner = true;
    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('challenge_type', 'oob redirect');
    formData.append('username', this.attEmail.nativeElement.value);

    this.http.post<any>(environment.baseUrl + '/resetpassword/v1.0/start', formData).subscribe(result => {

      console.log(result);

      // Call the challenge endpoint 
      this.SSPR_2_Challenge(result.password_reset_token);

    }, errorResponse => {

      console.log(errorResponse);

      // Error handling;
      this.errorMessage = this.GetErrorMessage(errorResponse.error)
    });
  }

  SSPR_2_Challenge(credential_token: string) {

    console.log("SSPR_2_Challenge started");

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('challenge_type', 'oob redirect');
    formData.append('password_reset_token', credential_token);

    this.http.post<any>(environment.baseUrl + '/resetpassword/v1.0/challenge', formData).subscribe(result => {

      this.step = 2;
      // Pass the sign-up token to the next step
      this.showSpinner = false;
      this.password_reset_token = result.password_reset_token;

      console.log(result);

    }, errorResponse => {

      console.log(errorResponse);

      // Error handling
      this.errorMessage = this.GetErrorMessage(errorResponse.error)
    });
  }


  SSP3_3_VerifyOOB() {
    console.log("SSP3_3_VerifyOOB started");
    this.showSpinner = true;

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('grant_type', 'oob');
    formData.append('password_reset_token', this.password_reset_token);
    formData.append('oob', this.attOTP.nativeElement.value);

    this.http.post<any>(environment.baseUrl + '/resetpassword/v1.0/continue', formData).subscribe(result => {

      console.log(result);

      this.step = 3;
      this.showSpinner = false;
      this.password_reset_token = result.password_submit_token;

    }, errorResponse => {

      console.log(errorResponse);

      // Error handling
      this.errorMessage = this.GetErrorMessage(errorResponse.error);

    });
  }


  SSPR_4_Submit() {

    console.log("SSPR_4_Submit started");
    this.showSpinner = true;
    
    console.log
    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('password_submit_token', this.password_reset_token);
    formData.append('new_password', this.attPassword.nativeElement.value);

    this.http.post<any>(environment.baseUrl + '/resetpassword/v1.0/submit', formData).subscribe(result => {

      console.log(result);

      this.step = 3;
      this.showSpinner = false;
      this.password_reset_token = result.password_submit_token;

      //this.interval = setInterval(this.SSPR_pollCompletion, 1000);
      this.step = 4;

    }, errorResponse => {

      console.log(errorResponse);

      // Error handling
      this.errorMessage = this.GetErrorMessage(errorResponse.error);

    });
  }


  SSPR_pollCompletion() {
    console.log("SSPR_pollCompletion started");

    console.log
    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('password_reset_token', this.password_reset_token);

    this.http.post<any>(environment.baseUrl + '/resetpassword/v1.0/poll_completion', formData).subscribe(result => {

      console.log(result);

      clearInterval(this.interval);

    }, errorResponse => {

      console.log(errorResponse);

      // Error handling
      this.errorMessage = this.GetErrorMessage(errorResponse.error);

    });
  }


  closeOverlay() {
    this.OverlayVisibilityEvent.emit(false);
    this.LoginButtonVisibilityEvent.emit(true);
  }

  GetErrorMessage(error: any) {

    this.showSpinner = false;

    if (error.error_description) {
      let i = error.error_description.indexOf("Trace");

      if (i > 0) {
        return error.error_description.substring(0, i - 1)
      }
    }

    return error.message;
  }
}
