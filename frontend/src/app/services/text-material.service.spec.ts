import { TestBed } from '@angular/core/testing';

import { TextMaterialService } from './text-material.service';

describe('TextMaterialService', () => {
  let service: TextMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
