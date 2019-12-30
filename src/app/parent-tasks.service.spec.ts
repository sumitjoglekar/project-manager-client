import { TestBed } from '@angular/core/testing';

import { ParentTasksService } from './parent-tasks.service';

describe('ParentTasksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParentTasksService = TestBed.get(ParentTasksService);
    expect(service).toBeTruthy();
  });
});
