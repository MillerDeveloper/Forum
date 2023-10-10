import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAgenciesPageComponent } from './card-agencies-page.component';

describe('CardAgenciesPageComponent', () => {
  let component: CardAgenciesPageComponent;
  let fixture: ComponentFixture<CardAgenciesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAgenciesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAgenciesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
