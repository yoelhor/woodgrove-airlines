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
    console.log(this.baseUrl)
    // this.http.get('https://api.example.com/endpoint')
    //   .subscribe(data => {
    //     // handle the data
    //   });
  }
}
