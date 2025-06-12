import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCourseInstitutionPage } from './add-course-institution.page';

describe('AddCourseInstitutionPage', () => {
  let component: AddCourseInstitutionPage;
  let fixture: ComponentFixture<AddCourseInstitutionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCourseInstitutionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
