import { TestBed } from '@angular/core/testing';

import { TeamCalendarService } from './team-calendar.service';

describe('TeamCalendarService', () => {
  let service: TeamCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
