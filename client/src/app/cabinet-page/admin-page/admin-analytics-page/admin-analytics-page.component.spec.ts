import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnalyticsPageComponent } from './admin-analytics-page.component';

describe('AdminAnalyticsPageComponent', () => {
  let component: AdminAnalyticsPageComponent;
  let fixture: ComponentFixture<AdminAnalyticsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAnalyticsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAnalyticsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
