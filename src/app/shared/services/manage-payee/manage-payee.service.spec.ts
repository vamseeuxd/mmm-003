import {TestBed} from '@angular/core/testing';

import {ManagePayeeService} from './manage-payee.service';

describe('TransactionService', () => {
  let service: ManagePayeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagePayeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
