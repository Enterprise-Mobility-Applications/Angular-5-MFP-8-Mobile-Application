import { TestBed, inject } from '@angular/core/testing';

import { AdapterService } from './adapter.service';

describe('AdapterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdapterService]
    });
  });

  it('should be created', inject([AdapterService], (service: AdapterService) => {
    expect(service).toBeTruthy();
  }));
});
