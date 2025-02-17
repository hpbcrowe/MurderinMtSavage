import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Blog } from 'src/app/models/blog/blog.model';
import { AccountService } from 'src/app/services/account.service';
import { BlogService } from 'src/app/services/blog.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  //had to add ! definite assignment
  userBlogs!: Blog[];

  constructor(
    //Dependencies
    private blogService: BlogService,
    private router: Router,
    private toastr: ToastrService,
    public accountService: AccountService,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Crowequest Home Page' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      {
        name: 'keywords',
        content: 'Genealogy, William, Crowe, Crow, Research, Family History',
      },
    ]);
    this.setTitle('Dashboard');
  }

  ngOnInit(): void {
    this.userBlogs = [];

    let currentApplicationUserId =
      this.accountService.currentUserValue.applicationUserId;

    this.blogService
      .getByApplicationUserId(currentApplicationUserId)
      .subscribe((userBlogs) => {
        //get the users blogs through the blog service and assign them 
        // to the this.userBlogs we create on line 39
        this.userBlogs = userBlogs;
      });
  }

  confirmDelete(blog: Blog) {
    blog.deleteConfirm = true;
  }

  cancelDeleteConfirm(blog: Blog) {
    blog.deleteConfirm = false;
  }

  deleteConfirmed(blog: Blog, blogs: Blog[]) {
    this.blogService.delete(blog.blogId).subscribe(() => {
      let index = 0;

      for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].blogId === blog.blogId) {
          index = i;
        }
      }
      if (index > -1) {
        //splice() deletes an element from an array
        this.toastr.info(`Blog "${blogs[index].title}" deleted.`);
        blogs.splice(index, 1);
        // second parameter means delete it up to 1
       
        
      }
     
    });
    //Don't need to reload window because of blogs.splice(index, 1)
   // window.location.reload();
  }

  editBlog(blogId: number) {
    this.router.navigate([`/dashboard/${blogId}`]);
  }

  createBlog() {
    this.router.navigate([`/dashboard/-1`]);
  }

  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }
}
