import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsprComponent } from './sspr.component';

describe('SsprComponent', () => {
  let component: SsprComponent;
  let fixture: ComponentFixture<SsprComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SsprComponent]
    });
    fixture = TestBed.createComponent(SsprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
