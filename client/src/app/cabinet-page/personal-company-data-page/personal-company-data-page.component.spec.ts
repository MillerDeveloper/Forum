import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCompanyDataPageComponent } from './personal-company-data-page.component';

describe('PersonalCompanyDataPageComponent', () => {
  let component: PersonalCompanyDataPageComponent;
  let fixture: ComponentFixture<PersonalCompanyDataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalCompanyDataPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalCompanyDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
