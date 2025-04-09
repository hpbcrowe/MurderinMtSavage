import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BlogPaging } from 'src/app/models/blog/blog-paging.model';
import { Blog } from 'src/app/models/blog/blog.model';
import { PagedResult } from 'src/app/models/blog/paged-result.model';
import { BlogService } from 'src/app/services/blog.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  pagedBlogResult!: PagedResult<Blog>;


  constructor(
    private blogService: BlogService,
    private meta: Meta, 
    private title: Title
  ) { 
    this.meta.addTags([
      {name: 'description', content: 'Blogs about the Crowe Family from Western Maryland'},
      {name: 'author', content: 'Ben Crowe / open-source code'},
      {name: 'keywords', content: 'Genealogy, William, Crowe, Crow, Research, Family History'}

    ]);
    this.setTitle('Crowe Genealogy Blogs');

  }
//ngOnInit calls the loadPagedBlogResult it will go to the first page and display 6 items
  ngOnInit(): void {
    this.loadPagedBlogResult(1,6);
  }

// this will be called when the page is changed page 2, page 3 etc  
  pageChanged(event: PageChangedEvent): void {
    this.loadPagedBlogResult(event.page, event.itemsPerPage);
  }

  loadPagedBlogResult(page: number, itemsPerPage: number){
    let blogPaging = new BlogPaging(page, itemsPerPage);

    this.blogService.getAll(blogPaging).subscribe(pagedBlogs => {
      this.pagedBlogResult = pagedBlogs;
    })
  }

  public setTitle(newTitle: string){
    this.title.setTitle( newTitle);
   }
}
