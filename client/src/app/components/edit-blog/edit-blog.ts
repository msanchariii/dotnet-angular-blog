import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { BlogFormComponent } from '../blog-form/blog-form';

@Component({
  selector: 'app-edit-blog',
  imports: [DialogModule, BlogFormComponent],
  templateUrl: './edit-blog.html',
  styleUrl: './edit-blog.css',
})
export class EditBlog {
  @Input() visible: boolean = false;
  @Input() editId: string | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<any>();

  onVisibleChange(visible: boolean) {
    this.visible = visible;
    this.visibleChange.emit(visible);
  }

  onSaveSuccess(updatedBlog: any) {
    this.saved.emit(updatedBlog);
    this.onVisibleChange(false);
  }
}
