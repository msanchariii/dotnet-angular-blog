import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBlog } from './my-blog';

describe('MyBlog', () => {
  let component: MyBlog;
  let fixture: ComponentFixture<MyBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBlog],
    }).compileComponents();

    fixture = TestBed.createComponent(MyBlog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
