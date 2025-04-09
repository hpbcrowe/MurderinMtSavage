import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Blog } from 'src/app/models/blog/blog.model';
import { BlogService } from 'src/app/services/blog.service';
import { PhotoService } from 'src/app/services/photo.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blog!: Blog;
  blogPhotoUrl!: string;
  blogAlt!: string;
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private photoService: PhotoService,
    private meta: Meta,
     private title: Title
  ) { 
    this.meta.addTags([
      {name: 'description', content: 'Single Post about Research being done about the Crowe family roots'},
      {name: 'author', content: 'Ben Crowe / open-source code'},
      {name: 'keywords', content: 'Genealogy, William, Crowe, Crow, Research, Family History'}

    ]);
    this.setTitle('Journal Entry / Post');
  }
  
  public setTitle(newTitle: string){
    this.title.setTitle( newTitle);
   }

  ngOnInit(): void {
    //Added the null assertion operator get('id)!);
    const blogId = parseInt(this.route.snapshot.paramMap.get('id')!);

    this.blogService.get(blogId).subscribe(blog => {
      this.blog = blog;

      if(!!this.blog.photoId){
        this.photoService.get(this.blog.photoId).subscribe(photo => {
          this.blogPhotoUrl = photo.imageUrl;
          this.blogAlt = photo.description; 
        });
      }
    });    
   
  }

}
