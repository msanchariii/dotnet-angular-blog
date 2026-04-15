import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { NewBlog } from './new-blog';
import { BlogService } from '../../services/blog/blog.service';
import { CategoryService } from '../../services/category/category.service';

describe('NewBlog', () => {
  let component: NewBlog;
  let fixture: ComponentFixture<NewBlog>;

  beforeEach(async () => {
    localStorage.setItem('userId', '00000000-0000-0000-0000-000000000001');

    await TestBed.configureTestingModule({
      imports: [NewBlog],
      providers: [
        {
          provide: BlogService,
          useValue: {
            createBlog: () => of({ success: true, statusCode: 200, message: 'ok', data: null }),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            getAllCategories: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewBlog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.removeItem('userId');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
