import { ChangeDetectorRef, Component } from '@angular/core';
import { BlogCard } from '../../components/blog-card/blog-card';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { BlogService } from '../../services/blog/blog.service';
import { FindBlog, FindBlogExtended } from '../../model/FindBlog';
import { FindCategory } from '../../model/FindCategory';
import { CategoryService } from '../../services/category/category.service';

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
  ) {}

  blogData: FindBlogExtended[] = [];
  categories: FindCategory[] = [];
  selectedCategory: FindCategory | undefined;

  sortBy = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
  ];

  selectedSort: string = 'newest';

  tags: Tag[] | undefined;
  selectedTags: Tag[] = [];

  ngOnInit() {
    this.blogService.findBlogs().subscribe((blogs) => {
      // console.log('Fetched blogs:', blogs);
      this.blogData = blogs;
      this.cdr.detectChanges();
    });
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
      this.cdr.detectChanges();
    });

    this.tags = [
      { name: 'Angular', id: 'angular' },
      { name: 'TypeScript', id: 'typescript' },
      { name: 'Web Development', id: 'web-development' },
    ];
  }

  onBookmarkChanged(event: { blogId: string; isBookmarked: boolean }) {
    const blog = this.blogData.find((b) => b.blogId === event.blogId);
    if (blog) {
      blog.isBookmarked = event.isBookmarked;
    }
  }
}
