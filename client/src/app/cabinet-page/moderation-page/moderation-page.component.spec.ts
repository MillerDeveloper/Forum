import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationPageComponent } from './moderation-page.component';

describe('ModerationPageComponent', () => {
  let component: ModerationPageComponent;
  let fixture: ComponentFixture<ModerationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModerationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModerationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
