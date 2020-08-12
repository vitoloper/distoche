import { TestBed } from '@angular/core/testing';

import { CulturalAssetService } from './cultural-asset.service';

describe('CulturalAssetService', () => {
  let service: CulturalAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CulturalAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
