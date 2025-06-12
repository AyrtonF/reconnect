import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseInstitutionPage } from './course-institution.page';

describe('CourseInstitutionPage', () => {
  let component: CourseInstitutionPage;
  let fixture: ComponentFixture<CourseInstitutionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseInstitutionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
