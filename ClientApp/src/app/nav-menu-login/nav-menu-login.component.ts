import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav-menu-login',
  templateUrl: './nav-menu-login.component.html',
  styleUrls: ['./nav-menu-login.component.css']
})
export class NavMenuLoginComponent {
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) 
  { 
    this.baseUrl = baseUrl
  }
  isOpen = false;
  baseUrl = "";

  Login() {
    console.log(this.baseUrl);
    this.http.get(this.baseUrl + 'weatherforecast').subscribe(result => {
      console.log(result);
      this.isOpen = false;
    }, error => console.error(error));
  }
}
