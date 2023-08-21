import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { display } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-nav-menu-login',
  templateUrl: './nav-menu-login.component.html',
  styleUrls: ['./nav-menu-login.component.css']
})
export class NavMenuLoginComponent {
  constructor(private http: HttpClient) { 
    this.displayName = this.getDisplayName();
  }

  isOpen = false;
  displayName = "";
  showLoginButton = true;
  userFlow = "signin";

  getDisplayName(){

    var dn = localStorage.getItem("displayName");

    if (dn == null)
    {
      this.showLoginButton = true;
      return "";
    }
    else
    {
      this.showLoginButton = false;
      return dn;
    }
  }

  public logout()
  {
    console.log("logout")
    this.showLoginButton = true;
    this.displayName = "";
    localStorage.clear();
  }

  updateDisplayName(displayName: string) {
    this.displayName = displayName;
    localStorage.setItem("displayName", displayName);
  }

  updateOverlayVisibility(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  updateLoginButtonVisibility(showLoginButton: boolean) {
    this.showLoginButton = showLoginButton;
  }

  updateUserFlow(userFlow: string) {
    this.userFlow = userFlow;
  }
}
