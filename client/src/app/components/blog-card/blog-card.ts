import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { BookmarkButton } from '../bookmark-button/bookmark-button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-card',
  imports: [BookmarkButton],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.css',
})
export class BlogCard {
  private router = inject(Router);
  @Input() author = 'Sanchari Mandal';
  @Input() blogTitle = 'Into the sky';
  @Input() blogContent =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  @Input() category = 'Editorial';
  @Input() publishedAt = 'Apr 13, 2026';
  @Input() tags: string[] = ['Insight', 'Writing', 'Strategy'];
  @Input() accentClass = 'bg-slate-950';
  @Input() avatarColor = 'bg-slate-900';
  @Input() initials = '';
  @Input() readTime = '';
  @Input() blogId = '';
  @Input() isBookmarked = false;
  @Input() isPublished: boolean | null | undefined;
  @Input() showBookmarkButton = true;
  @Input() isMyBlog = false;
  @Output() bookmarkChanged = new EventEmitter<{ blogId: string; isBookmarked: boolean }>();
  @Output() editClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();

  onBookmarkToggled(isBookmarked: boolean) {
    this.isBookmarked = isBookmarked;
    this.bookmarkChanged.emit({ blogId: this.blogId, isBookmarked });
  }

  viewBlog(blogId: string) {
    this.router.navigate(['/blog', blogId]);
  }

  onEditClicked() {
    if (!this.blogId) {
      return;
    }
    this.editClicked.emit(this.blogId);
  }

  onDeleteClicked() {
    if (!this.blogId) {
      return;
    }
    this.deleteClicked.emit(this.blogId);
  }
}
