import { TestBed } from '@angular/core/testing';

import { CreateTeamService } from './create-team.service';

describe('CreateTeamService', () => {
  let service: CreateTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
