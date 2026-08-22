import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Blog } from 'src/app/models/blog/blog.model';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent implements OnInit {

  //This is used for one component to pass information into
  //another component
  @Input()  blog!: Blog;

  blogPhotoUrl!: string;
  blogAlt!: string;

  constructor(
    private router: Router,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    if(!!this.blog.photoId){
      this.photoService.get(this.blog.photoId).subscribe({
        next: (photo) => {
          //if photo exists then load the imageUrl into the variable created in this service.
          if(!!photo){
            this.blogPhotoUrl = photo.imageUrl;
            this.blogAlt = photo.description;
          }
        },
        error: (error: HttpErrorResponse) => {
          const apiError = error?.error;
          const path = apiError?.Path ?? apiError?.path ?? `/api/Photo/${this.blog.photoId}`;
          const traceId = apiError?.TraceId ?? apiError?.traceId;
          console.error('[BlogCard] Failed to load photo.', {
            blogId: this.blog.blogId,
            photoId: this.blog.photoId,
            status: error.status,
            path,
            traceId,
            error,
          });
        }
      });
    }
  }

  readMore(blogId: number){
    this.router.navigate([`/blogs/${blogId}`]);
  }
}
