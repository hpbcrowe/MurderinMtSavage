import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BlogComment } from 'src/app/models/blog-comment/blog-comment.model';
import { BlogCommentViewModel } from 'src/app/models/blog-comment/blog-comment-view-model.model';
import { AccountService } from 'src/app/services/account.service';
import { BlogCommentService } from 'src/app/services/blog-comment.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  @Input() comments!: BlogCommentViewModel[];

  constructor(
    public accountService: AccountService,
    private toastr: ToastrService,
    private blogCommentService: BlogCommentService,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Crowequest Comment Page' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      {
        name: 'keywords',
        content: 'Genealogy, William, Crowe, Crow, Research, Family History',
      },
    ]);
    this.setTitle('Comment Section');
  }

  ngOnInit(): void {}

  /**
   * SETS FLAG TO BE ABLE TO EDIT A COMENT TO TREU
   * @param comment BLOGCOMENTVIEWODEL
   */

  editComment(comment: BlogCommentViewModel) {
    comment.isEditable = true;
  }

  /**
   *
   * @param comment BLOGCOMMENTVIEWMODEL
   * SETS FLAG TO CONFIRM THAT THEY WANT TO DELETE THE COMMENT
   * TO TRUE
   */
  showDeleteConfirm(comment: BlogCommentViewModel) {
    comment.deleteConfirm = true;
  }

  /**
   *
   *
   * @param comment  BLOGCOMMENTVIEWMODEL
   * SETS THE FLAG TO CONFIRM THE DELETE TO FALSE
   */
  cancelDeleteConfirm(comment: BlogCommentViewModel) {
    comment.deleteConfirm = false;
  }

  /**
   *
   * @param newTitle STRING
   * SETS THE TITLE OF THE PAGE FOR THE META,
   */
  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }

  /**
   * Delete Confirm
   * @param comment
   * @param comments
   * matches source code
   * this will be called when the user confirms they want to delete
   * comment.
   */
  deleteConfirm(
    comment: BlogCommentViewModel,
    comments: BlogCommentViewModel[]
  ) {
    this.blogCommentService.delete(comment.blogCommentId).subscribe(() => {
      let index = 0;

      for (let i = 0; i < comments.length; i++) {
        if (comments[i].blogCommentId === comment.blogCommentId) {
          index = i;
        }
      }
      //IF INDEX IS GREATER THAN -1 THAT MEANS THERE WAS A COMMENT
      if (index > -1) {
        //SPLICE CUTS THE VALUE AT THAT INDEX OUT OF THE ARRAY OR LIST, THE SECOND PARAMETER
        //IS HOW MANY VALUES TO CUT OUT
        comments.splice(index, 1);
      }

      this.toastr.info('Blog Comment Deleted.');
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
      //-1 means this is new there isnt a coment. 0 would be the first comment
      blogCommentId: -1,
      username: this.accountService.currentUserValue.username,
      publishDate: new Date(),
      updateDate: new Date(),
      isEditable: false,
      deleteConfirm: false,
      isReplying: true,
      comments: [],
    };

    comment.comments.push(replyComment);
  }

  /**
   * onCommentSaved
   * @param blogComment BLOGCOMMENTVIEWMODEL
   * @param comment BLOGCOMMENT 
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
