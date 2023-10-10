import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInfoCardComponent } from './company-info-card.component';

describe('CompanyInfoCardComponent', () => {
  let component: CompanyInfoCardComponent;
  let fixture: ComponentFixture<CompanyInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
