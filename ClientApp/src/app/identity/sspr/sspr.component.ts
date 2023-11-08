import { Component, ElementRef, Inject, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  @ViewChild('signInEmail') signInEmail!: ElementRef;
  @ViewChild('signInPassword') signInPassword!: ElementRef;

  errorMessage = "";

  GoToSignIn()
  {
    this.UserFlowEvent.emit("signin");
  }

  SSPR_1_Initiate() {

    this.errorMessage = "";
    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('challenge_type', 'password redirect');
    formData.append('username', this.signInEmail.nativeElement.value);

    this.http.post<any>(environment.baseUrl + '/oauth2/v2.0/initiate', formData).subscribe(result => {

      console.log("Result from SSPR_1_Initiate:");
      console.log(result);

      // Call the challenge endpoint 
      this.SSPR_2_Challenge(result.credential_token);

    }, error => console.error(error));
  }

  SSPR_2_Challenge(credential_token: string) {

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('challenge_type', 'password redirect');
    formData.append('credential_token', credential_token);

    this.http.post<any>(environment.baseUrl + '/oauth2/v2.0/challenge', formData).subscribe(result => {
      console.log("Result from SSPR_2_Challenge:");
      this.SSPR_3_Token(result.credential_token);
    }, error => console.error(error));
  }

  SSPR_3_Token(credential_token: string) {

    const formData = new FormData();
    formData.append('client_id', environment.appID);
    formData.append('grant_type', 'password');
    formData.append('password', this.signInPassword.nativeElement.value);
    formData.append('credential_token', credential_token);
    formData.append('scope', environment.scopes);

    this.http.post<any>(environment.baseUrl + '/oauth2/v2.0/token', formData).subscribe(result => {
      console.log("Result from SSPR_3_Token:");
      console.log(result);

      // Can be replaced with sessionStorage
      if (!result.error) {
        // Can be replaced with sessionStorage
        localStorage.setItem("accessToken", result.access_token);
        this.RetrieveDisplayName();
      }
      else {
        if (result.error_description.includes("AADSTS50126") || result.error_description.includes("AADSTS9002313")) {
          this.errorMessage = "We couldn't find an account with this email address or password.";
        }
        else {
          this.errorMessage = result.error_description;
        }

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

    }, error => console.error(error));
  }

  closeOverlay() {
    this.OverlayVisibilityEvent.emit(false);
    this.LoginButtonVisibilityEvent.emit(true);
  }
}
