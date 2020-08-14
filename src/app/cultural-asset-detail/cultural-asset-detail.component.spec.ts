import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CulturalAssetDetailComponent } from './cultural-asset-detail.component';

describe('CulturalAssetDetailComponent', () => {
  let component: CulturalAssetDetailComponent;
  let fixture: ComponentFixture<CulturalAssetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CulturalAssetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CulturalAssetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
