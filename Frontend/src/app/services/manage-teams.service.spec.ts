import { TestBed } from '@angular/core/testing';

import { ManageTeamsService } from './manage-teams.service';

describe('ManageTeamsService', () => {
  let service: ManageTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
