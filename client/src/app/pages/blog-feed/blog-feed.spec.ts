import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogFeed } from './blog-feed';

describe('BlogFeed', () => {
  let component: BlogFeed;
  let fixture: ComponentFixture<BlogFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogFeed],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogFeed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
