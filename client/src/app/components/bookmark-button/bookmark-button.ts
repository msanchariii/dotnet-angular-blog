import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-bookmark-button',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './bookmark-button.html',
  styleUrl: './bookmark-button.css',
  providers: [MessageService],
})
export class BookmarkButton {
  @Input() isBookmarked: boolean = false;
  @Input() blogId: string = '';
  @Output() bookmarkToggled = new EventEmitter<boolean>();
  private messageService = inject(MessageService);

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
        // console.log('Bookmark response:', response);
        if (response.success && response.data) {
          this.isBookmarked = response.data.isBookmarked;
          this.bookmarkToggled.emit(this.isBookmarked);
          // success toaster
          this.messageService.add({
            severity: 'success',
            summary: this.isBookmarked ? 'Bookmarked' : 'Bookmark Removed',
            detail: `Blog has been ${this.isBookmarked ? 'added to' : 'removed from'} your bookmarks.`,
          });
        } else {
          console.error('Bookmark toggle failed:', response.message);
          // error toaster
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update bookmark.',
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Bookmark HTTP error:', err);
        this.isLoading = false;
        // error toaster
      },
    });
  }
}
