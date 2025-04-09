import { Component, Input, OnInit } from '@angular/core';
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
      this.photoService.get(this.blog.photoId).subscribe(photo => {
        //if photo exists then load the imageUrl into the variable created in this service.
        if(!!photo){
          this.blogPhotoUrl = photo.imageUrl;
          this.blogAlt = photo.description; 

        }
      })
    }
  }

  readMore(blogId: number){
    this.router.navigate([`/blogs/${blogId}`]);
  }
}
