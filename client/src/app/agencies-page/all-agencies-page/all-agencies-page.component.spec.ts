import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAgenciesPageComponent } from './all-agencies-page.component';

describe('AllAgenciesPageComponent', () => {
  let component: AllAgenciesPageComponent;
  let fixture: ComponentFixture<AllAgenciesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllAgenciesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAgenciesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
