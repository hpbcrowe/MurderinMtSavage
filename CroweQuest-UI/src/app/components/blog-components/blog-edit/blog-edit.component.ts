import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ToastrService } from 'ngx-toastr';
import { BlogCreate } from 'src/app/models/blog/blog-create.model';
import { Blog } from 'src/app/models/blog/blog.model';
import { Photo } from 'src/app/models/photo/photo.model';
import { BlogService } from 'src/app/services/blog.service';
import { PhotoService } from 'src/app/services/photo.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css'],
})
export class BlogEditComponent implements OnInit {
  //Added definate assignment operator !
  blogForm!: FormGroup;
  confirmImageDelete: boolean = false;
  userPhotos: Photo[] = [];
  constructor(
    //dependencies
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private photoService: PhotoService,
    private toastr: ToastrService,
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Form to edit user Crowe family history journal entry, photo, title ',
      },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      {
        name: 'keywords',
        content: 'Genealogy, William, Crowe, Crow, Research, Family History',
      },
    ]);
    this.setTitle('Editing a Blog');
  }

  ngOnInit(): void {
    //Had to put the assertion operator after paramMap.get('id')!)
    //To get rid of the error type null is not assignable to type string
    const blogId = parseInt(this.route.snapshot.paramMap.get('id')!);

    this.blogForm = this.formBuilder.group({
      blogId: [blogId],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(50),
        ],
      ],
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(50),
          Validators.maxLength(5000),
        ],
      ],
      photoDescription: [null],
      photoId: [null],
    });

    this.photoService.getByApplicationUserId().subscribe((userPhotos) => {
      this.userPhotos = userPhotos;
    });

    if (!!blogId && blogId !== -1) {
      this.blogService.get(blogId).subscribe((blog) => {
        this.updateForm(blog);
      });
    }
  }

  getPhoto(photoId: number) {
    for (let i = 0; i < this.userPhotos.length; i++) {
      if (this.userPhotos[i].photoId === photoId) {
        return this.userPhotos[i];
      }
    }
    return null;
  }

  isTouched(field: string) {
    return this.blogForm.get(field)?.touched;
  }


//hasErrors is for seeing a field has errors
  hasErrors(field: string) {
    return this.blogForm.get(field)?.errors;
  }

//hasError() is for if a specific field has a specific error
  hasError(field: string, error: string) {
    return !!this.blogForm.get(field)?.hasError(error);
  }

  //This is to see if the blog is new, this will return -1 if it is new 
  isNew() {
    return parseInt(this.blogForm.get('blogId')?.value) === -1;
  }

  detachPhoto() {
    this.blogForm.patchValue({
      photoId: null,
      photoDescription: null,
    });
  }

  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }

  updateForm(blog: Blog) {
    //had to add assertion operator onto blog.photoId(!)
    let photoDescription = this.getPhoto(blog.photoId!)?.description;

    this.blogForm.patchValue({
      blogId: blog.blogId,
      title: blog.title,
      content: blog.content,
      photoId: blog.photoId,
      photoDescription: photoDescription,
    });
  }


// type ahead match from ngx bootstrap, this is how the photos are attached
//once you start typing it will show you the available photos the user has that 
//they have uploaded that they can attach to the blog.
  onSelect(event: TypeaheadMatch): void {
    let chosenPhoto: Photo = event.item;
    //after photos is attached update the form
    this.blogForm.patchValue({
      photoId: chosenPhoto.photoId,
      photoDescription: chosenPhoto.description,
    });
  }

  //once the submit button is clicked create blog model
  onSubmit() {
    let blogCreate: BlogCreate = new BlogCreate(
      this.blogForm.get('blogId')?.value,
      this.blogForm.get('title')?.value,
      this.blogForm.get('content')?.value,
      this.blogForm.get('photoId')?.value
    );

    this.blogService.create(blogCreate).subscribe((createdBlog) => {
      this.updateForm(createdBlog);
      this.toastr.info(`Blog "${createdBlog.title}" saved.`);
      this.router.navigate(['/dashboard']);
    });
  }
}
