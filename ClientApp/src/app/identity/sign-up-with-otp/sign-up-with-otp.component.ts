import { Component, ElementRef, Inject, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-sign-up-with-otp',
  templateUrl: './sign-up-with-otp.component.html',
  styleUrls: ['./sign-up-with-otp.component.css']
})
export class SignUpWithOtpComponent {
  // Sharing data between child and parent components events
  @Output() displayNameEvent = new EventEmitter<string>();
  @Output() OverlayVisibilityEvent = new EventEmitter<boolean>();
  @Output() LoginButtonVisibilityEvent = new EventEmitter<boolean>();
  @Output() UserFlowEvent = new EventEmitter<string>();
}
