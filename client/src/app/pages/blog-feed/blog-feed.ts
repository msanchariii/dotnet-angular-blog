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
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { EditBlog } from '../../components/edit-blog/edit-blog';
import { TagService } from '../../services/tag.service';
import { FindTag } from '../../model/Tag';

@Component({
  selector: 'app-blog-feed',
  imports: [BlogCard, FormsModule, SelectModule, MultiSelectModule, PaginatorModule, EditBlog],
  templateUrl: './blog-feed.html',
  styleUrl: './blog-feed.css',
})
export class BlogFeed {
  constructor(
    private blogService: BlogService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  blogData: FindBlogExtended[] = [];
  categories: FindCategory[] = [];
  selectedCategoryId: string | undefined;
  tags: FindTag[] = [];
  selectedTags: string[] = [];
  first = 0;
  rows: 5 | 10 | 20 | 50 | 100 = 10;
  totalRecords = 0;

  sortBy = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
  ];

  selectedSort: 'newest' | 'oldest' = 'newest';

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
      this.cdr.detectChanges();
    });

    this.route.queryParamMap.subscribe((params) => {
      const sortBy = params.get('sortBy');
      const categoryId = params.get('categoryId');
      const tags = params.getAll('tags');
      const pageNo = params.get('pageNo');
      const pageSize = params.get('pageSize');
      const parsedPageNo = this.parsePageNo(pageNo);
      const parsedPageSize = this.parsePageSize(pageSize);

      this.selectedSort = sortBy === 'oldest' ? 'oldest' : 'newest';
      this.selectedCategoryId = categoryId ?? undefined;
      this.selectedTags = tags.filter((tag) => tag.trim().length > 0);
      this.rows = parsedPageSize;
      this.first = ((parsedPageNo ?? 1) - 1) * parsedPageSize;

      this.blogService
        .findBlogs({
          PageSize: parsedPageSize,
          PageNo: parsedPageNo,
          SortBy: this.selectedSort,
          CategoryId: this.selectedCategoryId,
          Tags: this.selectedTags,
        })
        .subscribe((blogs) => {
          this.blogData = blogs;
          this.totalRecords = blogs[0]?.totalRecords ?? blogs.length;
          this.cdr.detectChanges();
        });
    });

    this.tagService.getAllTags().subscribe((tags) => {
      this.tags = tags.data ?? [];
    });
  }

  applyFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sortBy: this.selectedSort,
        categoryId: this.selectedCategoryId || null,
        tags: this.selectedTags.length > 0 ? this.selectedTags : null,
        pageNo: 1,
        pageSize: this.rows,
      },
      queryParamsHandling: 'merge',
    });
  }

  sanitizedBlogPreview(content: string): string {
    return this.blogService.sanitizeBlogPreview(content);
  }

  resetFilters() {
    this.selectedSort = 'newest';
    this.selectedCategoryId = undefined;
    this.selectedTags = [];

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sortBy: this.selectedSort,
        categoryId: null,
        tags: null,
        pageNo: 1,
        pageSize: this.rows,
      },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(event: PaginatorState) {
    const nextRows = this.parsePageSize(event.rows?.toString() ?? null);
    const nextFirst = event.first ?? 0;
    const nextPageNo = Math.floor(nextFirst / nextRows) + 1;

    this.first = nextFirst;
    this.rows = nextRows;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        pageNo: nextPageNo,
        pageSize: nextRows,
      },
      queryParamsHandling: 'merge',
    });
  }

  private parsePageNo(pageNo: string | null): number | undefined {
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
      this.cdr.detectChanges();
    }
  }
}
