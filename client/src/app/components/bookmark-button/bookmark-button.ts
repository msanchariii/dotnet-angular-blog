import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BookmarkService } from '../../services/bookmark/bookmark.service';

@Component({
  selector: 'app-bookmark-button',
  standalone: true,
  imports: [],
  templateUrl: './bookmark-button.html',
  styleUrl: './bookmark-button.css',
})
export class BookmarkButton {
  @Input() isBookmarked: boolean = false;
  @Input() blogId: string = '';
  @Output() bookmarkToggled = new EventEmitter<boolean>();

  isLoading: boolean = false;

  constructor(private bookmarkService: BookmarkService) {}

  handleBookmarkClick() {
    if (this.isLoading || !this.blogId) {
      console.warn('handleBookmarkClick blocked:', {
        isLoading: this.isLoading,
        blogId: this.blogId,
      });
      return;
    }

    this.isLoading = true;
    this.bookmarkService.toggleBookmark(this.blogId).subscribe({
      next: (response) => {
        console.log('Bookmark response:', response);
        if (response.success && response.data) {
          this.isBookmarked = response.data.isBookmarked;
          this.bookmarkToggled.emit(this.isBookmarked);
        } else {
          console.error('Bookmark toggle failed:', response.message);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Bookmark HTTP error:', err);
        this.isLoading = false;
      },
    });
  }
}
