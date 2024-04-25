import { TestBed } from '@angular/core/testing';

import { TermConditionService } from './term-condition.service';

describe('TermConditionService', () => {
  let service: TermConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TermConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
