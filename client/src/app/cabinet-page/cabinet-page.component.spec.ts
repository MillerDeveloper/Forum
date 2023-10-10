import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetPageComponent } from './cabinet-page.component';

describe('CabinetPageComponent', () => {
  let component: CabinetPageComponent;
  let fixture: ComponentFixture<CabinetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabinetPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabinetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
