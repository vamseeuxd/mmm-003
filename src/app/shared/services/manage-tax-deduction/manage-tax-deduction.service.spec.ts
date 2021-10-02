import { TestBed } from '@angular/core/testing';

import { ManageTaxDeductionService } from './manage-tax-deduction.service';

describe('ManageTaxDeductionService', () => {
  let service: ManageTaxDeductionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageTaxDeductionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
