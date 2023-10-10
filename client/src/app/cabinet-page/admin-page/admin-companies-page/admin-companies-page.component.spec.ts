import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompaniesPageComponent } from './admin-companies-page.component';

describe('AdminCompaniesPageComponent', () => {
  let component: AdminCompaniesPageComponent;
  let fixture: ComponentFixture<AdminCompaniesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCompaniesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCompaniesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
