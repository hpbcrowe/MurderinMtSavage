import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { BlogComment } from 'src/app/models/blog-comment/blog-comment.model';
import { BlogCommentViewModel } from 'src/app/models/blog-comment/blog-comment-view-model.model';
import { AccountService } from 'src/app/services/account.service';
import { BlogCommentService } from 'src/app/services/blog-comment.service';

@Component({
  selector: 'app-comment-system',
  templateUrl: './comment-system.component.html',
  styleUrls: ['./comment-system.component.css'],
})
export class CommentSystemComponent implements OnInit {
  @Input() blogId!: number;

  standAloneComment!: BlogCommentViewModel;
  blogComments!: BlogComment[];
  blogCommentViewModels!: BlogCommentViewModel[];

  constructor(
    private blogCommentService: BlogCommentService,
    public accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.blogCommentService.getAll(this.blogId).subscribe((blogComments) => {
      if (this.accountService.isLoggedIn()) {
        this.initComment(this.accountService.currentUserValue.username);
      }

      this.blogComments = blogComments;
      this.blogCommentViewModels = [];

      for (let i = 0; i < this.blogComments.length; i++) {
        //if the comment has a parent id then that means it is a reply
        if (!this.blogComments[i].parentBlogCommentId) {
          // call the find comment replies function which is recursive to find all of the replies to that 
          // reply
          this.findCommentReplies(this.blogCommentViewModels, i);
        }
      }
    });
  }

/** initComment
 * empy comment that is going to be initialized
 * @param username 
 */

  initComment(username: string) {
    this.standAloneComment = {
      parentBlogCommentId: null,
      content: '',
      blogId: this.blogId,
      blogCommentId: -1,
      username: username,
      publishDate: null,
      updateDate: null,
      isEditable: false,
      deleteConfirm: false,
      isReplying: false,
      comments: [],
    };
  }

  /**Find comment replies
   *
   * @param blogCommentViewModels
   * @param index
   * This matches the source code
   */
  findCommentReplies(
    blogCommentViewModels: BlogCommentViewModel[],
    index: number
  ) {
    let firstElement = this.blogComments[index];
    let newComments: BlogCommentViewModel[] = [];

    let commentViewModel: BlogCommentViewModel = {
      parentBlogCommentId: firstElement.parentBlogCommentId || null,
      content: firstElement.content,
      blogId: firstElement.blogId,
      blogCommentId: firstElement.blogCommentId,
      username: firstElement.username,
      publishDate: firstElement.publishDate,
      updateDate: firstElement.updateDate,
      isEditable: false,
      deleteConfirm: false,
      isReplying: false,
      comments: newComments,
    };

    //Push the commentviewmodel we just initialized above onto the 
    //blogcommentviewmodels from line 18
    blogCommentViewModels.push(commentViewModel);

    // loop through all blog comments
  
    for (let i = 0; i < this.blogComments.length; i++) {
      if (
        //if comments [current one]'s parent id is equal to the first element's id then
        // the current one [the comment] is a reply to the first element
        this.blogComments[i].parentBlogCommentId === firstElement.blogCommentId
      ) {
        //call this same function {recursion} to find the replies of the reply
        this.findCommentReplies(newComments, i);
      }
    }
  }

  /**
   * On Comment Saved
   * @param blogComment
   * Matches source code
   */
  onCommentSaved(blogComment: BlogComment) {
    //Save as a view model
    let commentViewModel: BlogCommentViewModel = {
      parentBlogCommentId: blogComment.parentBlogCommentId,
      content: blogComment.content,
      blogId: blogComment.blogId,
      blogCommentId: blogComment.blogCommentId,
      username: blogComment.username,
      publishDate: blogComment.publishDate,
      updateDate: blogComment.updateDate,
      isEditable: false,
      deleteConfirm: false,
      isReplying: false,
      comments: [],
    };

    //Add to view model
    this.blogCommentViewModels.unshift(commentViewModel);
  }
}
