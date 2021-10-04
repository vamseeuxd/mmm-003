import { TestBed } from '@angular/core/testing';

import { PromptUpdateServiceService } from './prompt-update-service.service';

describe('PromptUpdateServiceService', () => {
  let service: PromptUpdateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromptUpdateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
