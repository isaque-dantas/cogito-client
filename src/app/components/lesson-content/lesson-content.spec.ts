import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonContent } from './lesson-content';

describe('LessonContent', () => {
  let component: LessonContent;
  let fixture: ComponentFixture<LessonContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
