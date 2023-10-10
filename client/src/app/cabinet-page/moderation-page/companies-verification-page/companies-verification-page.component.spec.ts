import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesVerificationPageComponent } from './companies-verification-page.component';

describe('CompaniesVerificationPageComponent', () => {
  let component: CompaniesVerificationPageComponent;
  let fixture: ComponentFixture<CompaniesVerificationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesVerificationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesVerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
