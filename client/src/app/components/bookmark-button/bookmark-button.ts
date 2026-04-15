import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Optional for simple binding, but good practice

@Component({
  selector: 'app-bookmark-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookmark-button.html',
  styleUrl: './bookmark-button.css',
})
export class BookmarkButton {
  @Input() isBookmarked: boolean = false;

  handleBookmarkClick() {
    this.isBookmarked = !this.isBookmarked;
    // Here you can also emit an event or call a service to update the bookmark status in your backend
  }
}
