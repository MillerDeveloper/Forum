import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsVerificationPageComponent } from './comments-verification-page.component';

describe('CommentsVerificationPageComponent', () => {
  let component: CommentsVerificationPageComponent;
  let fixture: ComponentFixture<CommentsVerificationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsVerificationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsVerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
