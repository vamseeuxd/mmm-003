import { TestBed } from '@angular/core/testing';

import { ManagePayerService } from './manage-payer.service';

describe('ManagePayerService', () => {
  let service: ManagePayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagePayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
