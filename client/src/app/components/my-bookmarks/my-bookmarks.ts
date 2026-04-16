import { ChangeDetectorRef, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { BlogCard } from '../blog-card/blog-card';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { BlogService } from '../../services/blog/blog.service';
import { FindBlogExtended } from '../../model/FindBlog';
import { FindCategory } from '../../model/FindCategory';
import { CategoryService } from '../../services/category/category.service';

interface Tag {
  name: string;
  id: string;
}

@Component({
  selector: 'app-my-bookmarks',
  imports: [BlogCard, FormsModule, SelectModule, MultiSelectModule, NgFor],
  templateUrl: './my-bookmarks.html',
  styleUrl: './my-bookmarks.css',
})
export class MyBookmarks {
  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
  ) {}

  blogData: FindBlogExtended[] = [];

  ngOnInit() {
    this.blogService.getMyBookmarks().subscribe((blogs) => {
      this.blogData = blogs;
      // console.log('Bookmarks:', blogs);

      this.cdr.detectChanges();
    });
  }

  onBookmarkChanged(event: { blogId: string; isBookmarked: boolean }) {
    if (!event.isBookmarked) {
      this.blogData = this.blogData.filter((b) => b.blogId !== event.blogId);
      this.cdr.detectChanges();
      return;
    }

    const blog = this.blogData.find((b) => b.blogId === event.blogId);
    if (blog) {
      blog.isBookmarked = event.isBookmarked;
    }
  }

  trackByBlogId(_: number, blog: FindBlogExtended) {
    return blog.blogId;
  }
}
