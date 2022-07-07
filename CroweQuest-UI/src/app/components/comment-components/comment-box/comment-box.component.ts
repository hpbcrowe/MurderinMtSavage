import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlogComment } from 'src/app/models/blog-comment/blog-comment';
import { BlogCommentCreate } from 'src/app/models/blog-comment/blog-comment-create.model';
import { BlogCommentViewModel } from 'src/app/models/blog-comment/blog-comment-view-model';
import { BlogCommentService } from 'src/app/services/blog-comment.service';


@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit {

  @Input() comment!: BlogCommentViewModel;
  @Output() commentSaved = new EventEmitter<BlogComment>();

  @ViewChild('commentForm') commentForm!: NgForm;


  constructor(
    private blogCommentService: BlogCommentService,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
  }

  resetComment(){
    this.commentForm.reset();
  }

  onSubmit() {
    let blogCommentCreate: BlogCommentCreate = {
      blogCommentId: this.comment.blogCommentId,
      parentBlogCommentId: this.comment.parentBlogCommentId,
      blogId: this.comment.blogId,
      content: this.comment.content
    };
    this.blogCommentService.create(blogCommentCreate).subscribe(blogComment => {
      
      this.commentSaved.emit(blogComment);
      this.resetComment();
      this.toastr.info('Comment Saved.')
    });
  }

}
