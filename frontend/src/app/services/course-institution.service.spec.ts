import { TestBed } from '@angular/core/testing';

import { CourseInstitutionService } from './course-institution.service';

describe('CourseInstitutionService', () => {
  let service: CourseInstitutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseInstitutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
