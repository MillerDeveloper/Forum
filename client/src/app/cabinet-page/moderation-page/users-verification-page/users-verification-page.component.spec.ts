import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersVerificationPageComponent } from './users-verification-page.component';

describe('UsersVerificationPageComponent', () => {
  let component: UsersVerificationPageComponent;
  let fixture: ComponentFixture<UsersVerificationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersVerificationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersVerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
