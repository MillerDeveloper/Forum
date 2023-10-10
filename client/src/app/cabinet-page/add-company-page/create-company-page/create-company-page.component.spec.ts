import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompanyPageComponent } from './create-company-page.component';

describe('CreateCompanyPageComponent', () => {
  let component: CreateCompanyPageComponent;
  let fixture: ComponentFixture<CreateCompanyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCompanyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompanyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
