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
  
  isOpen = false;
  baseUrl = "https://wggdev.ciamlogin.com/wggdev.onmicrosoft.com/oauth2/v2.0/";
  appID = "f28eb79b-f279-45ca-87b1-6a8421f54bc1"

  LoginInitiate() {

    const formData = new FormData();
    formData.append('client_id', this.appID);
    formData.append('challenge_type', 'password redirect');
    formData.append('username', this.signInEmail.nativeElement.value);

    this.http.post(this.baseUrl + 'initiate?dc=ESTS-PUB-WUS2-AZ1-FD000-TEST1', formData).subscribe(result => {
      console.log(result);
      this.isOpen = false;
    }, error => console.error(error));
  }
}
