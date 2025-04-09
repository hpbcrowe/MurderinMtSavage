/*********************
 *
 * This Blog Comment View Model
 * has more fields to save replies,
 * this is the model that will communicate
 * with the API
 *
 ********************/

export class BlogCommentViewModel {
  constructor(
    public parentBlogCommentId: number | null | undefined,
    public blogCommentId: number,
    public blogId: number,
    public content: string,
    public username: string,
    public publishDate: Date | null | undefined,
    public updateDate: Date | null | undefined,
    public isEditable: boolean = false,
    public deleteConfirm: boolean = false,
    public isReplying: boolean = false,
    public comments: BlogCommentViewModel[]
  ) {}
}
