import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlogComment } from 'src/app/models/blog-comment/blog-comment.model';
import { BlogCommentCreate } from 'src/app/models/blog-comment/blog-comment-create.model';
import { BlogCommentViewModel } from 'src/app/models/blog-comment/blog-comment-view-model.model';
import { BlogCommentService } from 'src/app/services/blog-comment.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css'],
})
export class CommentBoxComponent implements OnInit {
  @Input() comment!: BlogCommentViewModel;
  @Output() commentSaved = new EventEmitter<BlogComment>();

  @ViewChild('commentForm') commentForm!: NgForm;

  constructor(
    private blogCommentService: BlogCommentService,
    private toastr: ToastrService,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'User Commenting area' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      {
        name: 'keywords',
        content: 'Genealogy, William, Crowe, Crow, Research, Family History',
      },
    ]);
    this.setTitle('Comment Box');
  }

  public maxLength = 300;
  public remainingCharacters = this.maxLength;

  ngOnInit(): void {
    this.updateRemainingCharacters(this.comment?.content);
  }

  /**
   * resetComment()
   * resests coment form
   */
  resetComment() {
    this.commentForm.reset();
    this.updateRemainingCharacters('');
  }

  onCommentInput(value: string): void {
    this.updateRemainingCharacters(value);
  }

  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }

  /**
   * onSubmit
   * This matches the source code.
   * this is the function called by the submit button
   */
  onSubmit() {
    let blogCommentCreate: BlogCommentCreate = {
      blogCommentId: this.comment.blogCommentId,
      parentBlogCommentId: this.comment.parentBlogCommentId,
      blogId: this.comment.blogId,
      content: this.comment.content,
    };

    this.blogCommentService
      .create(blogCommentCreate)
      .subscribe((blogComment) => {
        this.toastr.info(` ${blogComment.username}'s Comment Saved. `);
        this.resetComment();
        this.commentSaved.emit(blogComment);
      });
  }

  private updateRemainingCharacters(content: string | null | undefined): void {
    const length = (content ?? '').length;
    this.remainingCharacters = Math.max(this.maxLength - length, 0);
  }
}
