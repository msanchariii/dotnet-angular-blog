import { ChangeDetectorRef, Component } from '@angular/core';
import { BlogCard } from '../../components/blog-card/blog-card';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { BlogService } from '../../services/blog/blog.service';
import { FindBlogExtended } from '../../model/FindBlog';
import { FindCategory } from '../../model/FindCategory';
import { CategoryService } from '../../services/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Tag {
  name: string;
  id: string;
}

@Component({
  selector: 'app-blog-feed',
  imports: [BlogCard, FormsModule, SelectModule, MultiSelectModule],
  templateUrl: './blog-feed.html',
  styleUrl: './blog-feed.css',
})
export class BlogFeed {
  constructor(
    private blogService: BlogService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  blogData: FindBlogExtended[] = [];
  categories: FindCategory[] = [];
  selectedCategoryId: string | undefined;

  sortBy = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
  ];

  selectedSort: 'newest' | 'oldest' = 'newest';

  tags: Tag[] | undefined;
  selectedTags: Tag[] = [];

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
      this.cdr.detectChanges();
    });

    this.route.queryParamMap.subscribe((params) => {
      const sortBy = params.get('sortBy');
      const categoryId = params.get('categoryId');
      const pageNo = params.get('pageNo');
      const pageSize = params.get('pageSize');

      this.selectedSort = sortBy === 'oldest' ? 'oldest' : 'newest';
      this.selectedCategoryId = categoryId ?? undefined;

      this.blogService
        .findBlogs({
          PageSize: this.parsePageSize(pageSize),
          PageNo: this.parsePageNo(pageNo),
          SortBy: this.selectedSort,
          CategoryId: this.selectedCategoryId,
        })
        .subscribe((blogs) => {
          this.blogData = blogs;
          this.cdr.detectChanges();
        });
    });

    this.tags = [
      { name: 'Angular', id: 'angular' },
      { name: 'TypeScript', id: 'typescript' },
      { name: 'Web Development', id: 'web-development' },
    ];
  }

  applyFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sortBy: this.selectedSort,
        categoryId: this.selectedCategoryId || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private parsePageNo(pageNo: string | null): Number | undefined {
    if (!pageNo) {
      return undefined;
    }
    const parsed = Number(pageNo);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return undefined;
    }
    return parsed;
  }

  private parsePageSize(pageSize: string | null): 5 | 10 | 20 | 50 | 100 {
    const parsed = Number(pageSize);
    if (parsed === 5 || parsed === 10 || parsed === 20 || parsed === 50 || parsed === 100) {
      return parsed;
    }
    return 10;
  }

  onBookmarkChanged(event: { blogId: string; isBookmarked: boolean }) {
    const blog = this.blogData.find((b) => b.blogId === event.blogId);
    if (blog) {
      blog.isBookmarked = event.isBookmarked;
    }
  }
}
