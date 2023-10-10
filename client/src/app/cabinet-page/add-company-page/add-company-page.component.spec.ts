import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyPageComponent } from './add-company-page.component';

describe('AddCompanyPageComponent', () => {
  let component: AddCompanyPageComponent;
  let fixture: ComponentFixture<AddCompanyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCompanyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
