/*********************
 * 
 * This Blog Comment View Model 
 * has more fields to save replies, 
 * this is the model will communicate
 * with the API
 * 
 ********************/


export class BlogCommentViewModel{

    constructor(
        public parentBlogCommentId: number, 
        public blogId: number,
        public content: string,
        public username: string,
        public applicationUserId: number,
        public publishDate: Date,
        public updateDate: Date,
        public isEditable: boolean,
        public deleteConfirm: boolean,
        public isReplying: boolean,
        public comments: BlogCommentViewModel[]
               
    ) {}
}