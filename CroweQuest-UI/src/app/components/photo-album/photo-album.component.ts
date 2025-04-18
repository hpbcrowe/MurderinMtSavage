/*
 * Photo Album Component Typscript file
 * Holds the functions for the Angular front end component
 * Copied from Udemy course
 * Had a typo on my version couldn't figure out where it was.
 */

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'src/app/models/photo/photo.model';
import { PhotoService } from 'src/app/services/photo.service';
import { AccountService } from 'src/app/services/account.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-photo-album',
  templateUrl: './photo-album.component.html',
  styleUrls: ['./photo-album.component.css'],
})
export class PhotoAlbumComponent implements OnInit {
  @ViewChild('photoForm') photoForm!: NgForm;
  @ViewChild('photoUploadElement') photoUploadElement!: ElementRef;

  photos: Photo[] = [];
  photoFile: any;
  newPhotoDescription!: string;

  constructor(
    private photoService: PhotoService,
    private toastr: ToastrService,
    private meta: Meta,
    private title: Title,
    public accountService: AccountService
  ) {
    this.meta.addTags([
      {
        name: 'description',
        content: 'Users Photo Album uploaded images displayed',
      },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      {
        name: 'keywords',
        content: 'Genealogy, William, Crowe, Crow, Research, Family History',
      },
    ]);
    this.setTitle('Photo Album');
  }

  ngOnInit(): void {
    this.photoService.getByApplicationUserId().subscribe((userPhotos) => {
      this.photos = userPhotos;
    });
  }

  confirmDelete(photo: Photo) {
    photo.deleteConfirm = true;
  }

  cancelDeleteConfirm(photo: Photo) {
    photo.deleteConfirm = false;
  }

  deleteConfirmed(photo: Photo) {
    this.photoService.delete(photo.photoId).subscribe(() => {
      let index = 0;

      for (let i = 0; i < this.photos.length; i++) {
        if (this.photos[i].photoId === photo.photoId) {
          index = i;
        }
      }

      if (index > -1) {
        this.photos.splice(index, 1);
      }

      this.toastr.info('Photo deleted.');
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.photoFile = file;
    }
  }

  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.photoFile, this.newPhotoDescription);

    this.photoService.create(formData).subscribe((createdPhoto) => {
      this.photoForm.reset();
      this.photoUploadElement.nativeElement.value = '';

      this.toastr.info(`Photo "${createdPhoto.description}" uploaded`);
      this.photos.unshift(createdPhoto);
    });
  }
}
