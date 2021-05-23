import { TestBed } from '@angular/core/testing';

import { StartGameResolverService } from './start-game-resolver.service';

describe('StartGameResolverService', () => {
  let service: StartGameResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartGameResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
