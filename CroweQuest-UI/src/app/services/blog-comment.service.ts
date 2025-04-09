import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BlogComment } from '../models/blog-comment/blog-comment.model';
import { BlogCommentCreate } from '../models/blog-comment/blog-comment-create.model';

@Injectable({
  providedIn: 'root',
})
export class BlogCommentService {
  constructor(private http: HttpClient) {}

  create(model: BlogCommentCreate): Observable<BlogComment> {
    return this.http.post<BlogComment>(
      `${environment.webApi}/BlogComment`,
      model
    );
  }

  delete(BlogCommentId: number): Observable<number> {
    return this.http.delete<number>(
      `${environment.webApi}/BlogComment/${BlogCommentId}`
    );
  }

  getAll(blogId: number): Observable<BlogComment[]> {
    return this.http.get<BlogComment[]>(
      `${environment.webApi}/BlogComment/${blogId}`
    );
  }
}
