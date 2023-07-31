import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeJumbotronComponent } from './home-jumbotron.component';

describe('HomeJumbotronComponent', () => {
  let component: HomeJumbotronComponent;
  let fixture: ComponentFixture<HomeJumbotronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeJumbotronComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeJumbotronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
