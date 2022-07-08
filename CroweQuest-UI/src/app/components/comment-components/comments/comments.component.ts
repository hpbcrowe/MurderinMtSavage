import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BlogComment } from 'src/app/models/blog-comment/blog-comment';
import { BlogCommentViewModel } from 'src/app/models/blog-comment/blog-comment-view-model';
import { AccountService } from 'src/app/services/account.service';
import { BlogCommentService } from 'src/app/services/blog-comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() comments!: BlogCommentViewModel[];

  constructor(
    public accountService: AccountService,
    private toastr: ToastrService,
    private blogCommentService: BlogCommentService

  ) { }

  ngOnInit(): void {
  }

  editComment(comment: BlogCommentViewModel){
    comment.isEditable = true;
  }

  showDeleteConfirm(comment: BlogCommentViewModel){
    comment.deleteConfirm = true;
  }

  cancelDeleteConfirm(comment: BlogCommentViewModel){
    comment.deleteConfirm = false;
  }

  /**
   * Delete Confirm
   * @param comment
   * @param comments 
   * matches source code
   * this will be called when the user confirms they want to delete
   * comment.
   */
  deleteConfirm(comment: BlogCommentViewModel, comments: BlogCommentViewModel[]){
    this.blogCommentService.delete(comment.blogCommentId).subscribe(() => {
      let index = 0;

      for(let i=0; i < comments.length; i++){
        if(comments[i].blogCommentId === comment.blogCommentId ){
          index = i;
        }
      }
      if (index > -1){
        comments.splice(index, 1);
      }

      this.toastr.info("Blog Comment Deleted.");
    });
  }
  
  /**
   * Reply Comment
   * @param comment 
   * This matches the source code had to 
   * change parentBlogCommentId: comment.blogCommentId,
   * it was parentBlogCommentId: comment.blogId,
   */
   replyComment(comment: BlogCommentViewModel) {
    let replyComment: BlogCommentViewModel = {
      parentBlogCommentId: comment.blogCommentId,
      content: '',
      blogId: comment.blogId,
      blogCommentId: -1,
      username: this.accountService.currentUserValue.username,
      publishDate: new Date(),
      updateDate: new Date(),
      isEditable: false,
      deleteConfirm: false,
      isReplying: true,
      comments: []
    };

    comment.comments.push(replyComment);
  }

/**
 * onCommentSaved
 * @param blogComment 
 * @param comment 
 * This matches the source code
 */  

  onCommentSaved(blogComment: BlogComment, comment: BlogCommentViewModel) {
    comment.blogCommentId = blogComment.blogCommentId;
    comment.parentBlogCommentId = blogComment.parentBlogCommentId;
    comment.blogId = blogComment.blogId;
    comment.content = blogComment.content;
    comment.publishDate = blogComment.publishDate;
    comment.updateDate = blogComment.updateDate;
    comment.username = blogComment.username;
    comment.isEditable = false;
    comment.isReplying = false;
  }
}
