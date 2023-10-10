import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCompaniesPageComponent } from './personal-companies-page.component';

describe('PersonalCompaniesPageComponent', () => {
  let component: PersonalCompaniesPageComponent;
  let fixture: ComponentFixture<PersonalCompaniesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalCompaniesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalCompaniesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
