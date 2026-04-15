import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookmarks } from './my-bookmarks';

describe('MyBookmarks', () => {
  let component: MyBookmarks;
  let fixture: ComponentFixture<MyBookmarks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBookmarks],
    }).compileComponents();

    fixture = TestBed.createComponent(MyBookmarks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
