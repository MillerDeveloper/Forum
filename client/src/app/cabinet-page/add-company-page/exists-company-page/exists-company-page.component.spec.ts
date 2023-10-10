import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistsCompanyPageComponent } from './exists-company-page.component';

describe('ExistsCompanyPageComponent', () => {
  let component: ExistsCompanyPageComponent;
  let fixture: ComponentFixture<ExistsCompanyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistsCompanyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistsCompanyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
