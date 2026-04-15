import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkButton } from './bookmark-button';

describe('BookmarkButton', () => {
  let component: BookmarkButton;
  let fixture: ComponentFixture<BookmarkButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookmarkButton],
    }).compileComponents();

    fixture = TestBed.createComponent(BookmarkButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
