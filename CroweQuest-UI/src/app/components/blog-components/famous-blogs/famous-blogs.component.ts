import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Blog } from 'src/app/models/blog/blog.model';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-famous-blogs',
  templateUrl: './famous-blogs.component.html',
  styleUrls: ['./famous-blogs.component.css']
})
export class FamousBlogsComponent implements OnInit {

  famousBlogs: Blog[] = [];
  errorMessage = '';

  constructor(
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.blogService.getMostFamous().subscribe({
      next: (blogs) => {
        this.famousBlogs = blogs;
        this.errorMessage = '';
      },
      error: (error: HttpErrorResponse) => {
        const apiError = error?.error;
        const path = apiError?.Path ?? apiError?.path ?? '/api/Blog/famous';
        const traceId = apiError?.TraceId ?? apiError?.traceId;
        this.errorMessage = `Failed to load famous blogs (${error.status}). Path: ${path}${traceId ? ` | TraceId: ${traceId}` : ''}`;
        console.error('[FamousBlogs] Failed to load blogs.', {
          status: error.status,
          path,
          traceId,
          error,
        });
      },
    });
  }


}
