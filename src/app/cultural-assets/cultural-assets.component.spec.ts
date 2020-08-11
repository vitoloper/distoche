import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CulturalAssetsComponent } from './cultural-assets.component';

describe('CulturalAssetsComponent', () => {
  let component: CulturalAssetsComponent;
  let fixture: ComponentFixture<CulturalAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CulturalAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CulturalAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
