import { TestBed } from '@angular/core/testing';

import { TaskDetailService } from './task-detail.service';

describe('TaskDetailService', () => {
  let service: TaskDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
