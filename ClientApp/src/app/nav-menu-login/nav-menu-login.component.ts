import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-nav-menu-login',
  templateUrl: './nav-menu-login.component.html',
  styleUrls: ['./nav-menu-login.component.css']
})
export class NavMenuLoginComponent {
  constructor(private http: HttpClient) {}

  @ViewChild('signInEmail') signInEmail!: ElementRef;
  @ViewChild('signInPassword') signInPassword!: ElementRef;
  
  isOpen = false;
  baseUrl = "/";
  appID = "f28eb79b-f279-45ca-87b1-6a8421f54bc1"

  PasswordLogin_1_Initiate() {

    const formData = new FormData();
    formData.append('client_id', this.appID);
    formData.append('challenge_type', 'password redirect');
    formData.append('username', this.signInEmail.nativeElement.value);

    this.http.post<any>(this.baseUrl + 'Proxy/initiate', formData).subscribe(result => {

      console.log("Result from PasswordLogin_1_Initiate:");
      console.log(result);

      // Call the challenge endpoint 
      this.PasswordLogin_2_Challenge(result.credential_token);

    }, error => console.error(error));
  }

  PasswordLogin_2_Challenge(credential_token: string) {

    const formData = new FormData();
    formData.append('client_id', this.appID);
    formData.append('challenge_type', 'password redirect');
    formData.append('credential_token', credential_token);

    this.http.post<any>(this.baseUrl + 'Proxy/challenge', formData).subscribe(result => {
      console.log("Result from PasswordLogin_2_Challenge:");
      this.PasswordLogin_3_Token(result.credential_token);
    }, error => console.error(error));
  }

  PasswordLogin_3_Token(credential_token: string) {

    const formData = new FormData();
    formData.append('client_id', this.appID);
    formData.append('grant_type', 'password');
    formData.append('password', this.signInPassword.nativeElement.value);
    formData.append('credential_token', credential_token);
    formData.append('scope', "openid offline_access");

    this.http.post<any>(this.baseUrl + 'Proxy/token', formData).subscribe(result => {
      console.log("Result from PasswordLogin_3_Token:");
      console.log(result);

      // Can be replaced with sessionStorage
      localStorage.setItem("accessToken", result.access_token);
      this.isOpen = false;
      this.RetrieveDisplayName();
    }, error => console.error(error));
  }

  RetrieveDisplayName () {

    var headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    });
 
   const requestOptions = { headers: headers };

    this.http.get<any>(this.baseUrl + 'profile?accesstoken=' + localStorage.getItem('accessToken') /*, { headers: headers }**/).subscribe(result => {
      console.log("Result from RetrieveDisplayName:");
      console.log(result);
      this.isOpen = false;
    }, error => console.error(error));
  }
}
