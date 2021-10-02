import { TestBed } from '@angular/core/testing';

import { ManageExpensesForService } from './manage-expenses-for.service';

describe('ManageExpensesForService', () => {
  let service: ManageExpensesForService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageExpensesForService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
