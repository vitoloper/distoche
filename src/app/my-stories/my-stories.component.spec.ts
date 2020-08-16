import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStoriesComponent } from './my-stories.component';

describe('MyStoriesComponent', () => {
  let component: MyStoriesComponent;
  let fixture: ComponentFixture<MyStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
