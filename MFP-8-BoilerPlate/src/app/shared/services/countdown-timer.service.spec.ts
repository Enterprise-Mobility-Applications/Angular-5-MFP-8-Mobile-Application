import { TestBed, inject } from '@angular/core/testing';

import { CountdownTimerService } from './countdown-timer.service';

describe('CountdownTimerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountdownTimerService]
    });
  });

  it('should be created', inject([CountdownTimerService], (service: CountdownTimerService) => {
    expect(service).toBeTruthy();
  }));
});
