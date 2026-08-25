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
  statusMessage = '';
  isLoading = false;

  private readonly maxRetryAttempts = 3;
  private readonly retryDelayMs = 2500;

  constructor(
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.loadFamousBlogs();
  }

  private loadFamousBlogs(attempt: number = 1): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (attempt === 1) {
      this.statusMessage = 'Loading famous blogs...';
    } else {
      this.statusMessage = `Waking up the database. Retrying (${attempt - 1}/${this.maxRetryAttempts})...`;
    }

    this.blogService.getMostFamous().subscribe({
      next: (blogs) => {
        this.famousBlogs = blogs;
        this.errorMessage = '';
        this.statusMessage = '';
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        if (this.shouldRetry(error, attempt)) {
          window.setTimeout(() => this.loadFamousBlogs(attempt + 1), this.retryDelayMs);
          return;
        }

        const apiError = error?.error;
        const path = apiError?.Path ?? apiError?.path ?? '/api/Blog/famous';
        const traceId = apiError?.TraceId ?? apiError?.traceId;
        this.errorMessage = `Failed to load famous blogs (${error.status}). Path: ${path}${traceId ? ` | TraceId: ${traceId}` : ''}`;
        this.statusMessage = '';
        this.isLoading = false;
        console.error('[FamousBlogs] Failed to load blogs.', {
          status: error.status,
          path,
          traceId,
          attempt,
          error,
        });
      },
    });
  }

  private shouldRetry(error: HttpErrorResponse, attempt: number): boolean {
    if (attempt > this.maxRetryAttempts) {
      return false;
    }

    return error.status === 0 || error.status === 500 || error.status === 503;
  }

}
