import { TestBed } from '@angular/core/testing';

import { EventMessageService } from './event-message.service';

describe('EventMessageService', () => {
  let service: EventMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
