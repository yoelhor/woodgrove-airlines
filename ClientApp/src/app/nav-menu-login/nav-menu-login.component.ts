import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { display } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-nav-menu-login',
  templateUrl: './nav-menu-login.component.html',
  styleUrls: ['./nav-menu-login.component.css']
})
export class NavMenuLoginComponent {
  constructor(private http: HttpClient) { }

  isOpen = false;
  displayName = "";
  showLoginButton = true;

  updateDisplayName(displayName: string) {
    this.displayName = displayName;
  }

  updateOverlayVisibility(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  updateLoginButtonVisibility(showLoginButton: boolean) {
    this.showLoginButton = showLoginButton;
  }
}
