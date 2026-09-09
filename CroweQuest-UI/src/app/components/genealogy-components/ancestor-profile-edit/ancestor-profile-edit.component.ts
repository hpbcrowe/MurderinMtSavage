import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AncestorProfileCreate } from 'src/app/models/genealogy/ancestor-profile-create.model';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';
import { Photo } from 'src/app/models/photo/photo.model';
import { AncestorProfileService } from 'src/app/services/genealogy/ancestor-profile.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-ancestor-profile-edit',
  templateUrl: './ancestor-profile-edit.component.html'
})
export class AncestorProfileEditComponent implements OnInit {
  ancestorProfileForm!: FormGroup;
  userPhotos: Photo[] = [];
  ancestorPhotos: Photo[] = [];
  selectedUserPhotoId: number | null = null;
  photoFile: File | null = null;
  photoPreviewUrl: string | null = null;
  isPhotoDragActive: boolean = false;
  isPhotoUploading: boolean = false;
  readonly maxPhotoBytes: number = 10 * 1024 * 1024;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ancestorProfileService: AncestorProfileService,
    private photoService: PhotoService,
    private toastr: ToastrService,
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Edit ancestor profile and family history metadata' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      { name: 'keywords', content: 'Genealogy, Ancestor, Family Tree, Research' }
    ]);
    this.title.setTitle('Edit Ancestor Profile');
  }

  ngOnInit(): void {
    const ancestorProfileId = parseInt(this.route.snapshot.paramMap.get('id')!);

    this.ancestorProfileForm = this.formBuilder.group({
      ancestorProfileId: [ancestorProfileId],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      suffix: [''],
      gender: [''],
      birthDate: [''],
      birthLocation: [''],
      deathDate: [''],
      deathLocation: [''],
      biography: ['', [Validators.maxLength(5000)]],
      researchStatus: ['Researching'],
      familyBranch: [''],
      tags: [''],
      confidenceLevel: ['Possible'],
      profilePhotoId: [null]
    });

    this.photoService.getByApplicationUserId().subscribe((userPhotos) => {
      this.userPhotos = userPhotos;
    });

    if (!!ancestorProfileId && ancestorProfileId !== -1) {
      this.ancestorProfileService.get(ancestorProfileId).subscribe((ancestorProfile) => {
        this.updateForm(ancestorProfile);
        this.loadAncestorPhotos(ancestorProfileId);
      });
    }
  }

  ngOnDestroy(): void {
    this.clearPhotoPreviewUrl();
  }

  isNew() {
    return parseInt(this.ancestorProfileForm.get('ancestorProfileId')?.value) === -1;
  }

  getSelectedPhoto(): Photo | null {
    const selectedPhotoId = this.ancestorProfileForm.get('profilePhotoId')?.value;

    if (!selectedPhotoId) {
      return null;
    }

    for (let i = 0; i < this.ancestorPhotos.length; i++) {
      if (this.ancestorPhotos[i].photoId === parseInt(selectedPhotoId, 10)) {
        return this.ancestorPhotos[i];
      }
    }

    return null;
  }

  clearProfilePhotoSelection(): void {
    this.ancestorProfileForm.patchValue({
      profilePhotoId: null
    });
  }

  getAvailableUserPhotosForAttach(): Photo[] {
    const attachedPhotoIds = new Set<number>();

    for (let i = 0; i < this.ancestorPhotos.length; i++) {
      attachedPhotoIds.add(this.ancestorPhotos[i].photoId);
    }

    return this.userPhotos.filter((photo) => !attachedPhotoIds.has(photo.photoId));
  }

  isProfilePhoto(photoId: number): boolean {
    return this.ancestorProfileForm.get('profilePhotoId')?.value === photoId;
  }

  setProfilePhoto(photoId: number): void {
    this.ancestorProfileForm.patchValue({
      profilePhotoId: photoId
    });
  }

  attachSelectedExistingPhoto(): void {
    const ancestorProfileId = this.ancestorProfileForm.get('ancestorProfileId')?.value;

    if (!ancestorProfileId || ancestorProfileId === -1) {
      this.toastr.info('Save the ancestor profile first, then attach multiple photos.');
      return;
    }

    if (!this.selectedUserPhotoId) {
      this.toastr.warning('Please choose a photo to attach.');
      return;
    }

    this.ancestorProfileService.addPhoto(ancestorProfileId, this.selectedUserPhotoId).subscribe((affectedRows) => {
      if (affectedRows > 0) {
        this.loadAncestorPhotos(ancestorProfileId);
        if (!this.ancestorProfileForm.get('profilePhotoId')?.value) {
          this.setProfilePhoto(this.selectedUserPhotoId!);
        }
        this.toastr.info('Photo attached to ancestor.');
      } else {
        this.toastr.info('Photo is already attached or cannot be attached.');
      }

      this.selectedUserPhotoId = null;
    });
  }

  removeAncestorPhoto(photoId: number): void {
    const ancestorProfileId = this.ancestorProfileForm.get('ancestorProfileId')?.value;

    if (!ancestorProfileId || ancestorProfileId === -1) {
      return;
    }

    this.ancestorProfileService.removePhoto(ancestorProfileId, photoId).subscribe((affectedRows) => {
      if (affectedRows > 0) {
        this.ancestorPhotos = this.ancestorPhotos.filter((photo) => photo.photoId !== photoId);

        if (this.ancestorProfileForm.get('profilePhotoId')?.value === photoId) {
          this.clearProfilePhotoSelection();
        }

        this.toastr.info('Photo removed from ancestor.');
      }
    });
  }

  onPhotoPickerChange(event: any): void {
    const file = event?.target?.files?.[0];

    if (!file) {
      return;
    }

    this.setPhotoFile(file);
    event.target.value = '';
  }

  onPhotoDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isPhotoDragActive = true;
  }

  onPhotoDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isPhotoDragActive = false;
  }

  onPhotoDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isPhotoDragActive = false;

    const file = event.dataTransfer?.files?.[0];

    if (!file) {
      return;
    }

    this.setPhotoFile(file);
  }

  uploadPhotoAndAttach(): void {
    if (!this.photoFile || this.isPhotoUploading) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.photoFile, this.photoFile.name);
    this.isPhotoUploading = true;

    this.photoService.create(formData).subscribe({
      next: (createdPhoto) => {
        this.userPhotos.unshift(createdPhoto);

        const ancestorProfileId = this.ancestorProfileForm.get('ancestorProfileId')?.value;

        if (!!ancestorProfileId && ancestorProfileId !== -1) {
          this.ancestorProfileService.addPhoto(ancestorProfileId, createdPhoto.photoId).subscribe(() => {
            this.loadAncestorPhotos(ancestorProfileId);
            this.setProfilePhoto(createdPhoto.photoId);
          });
        } else {
          this.setProfilePhoto(createdPhoto.photoId);
        }

        this.photoFile = null;
        this.clearPhotoPreviewUrl();
        this.toastr.info(`Photo "${createdPhoto.description}" uploaded.`);
      },
      error: (errorResponse) => {
        const message = errorResponse?.error || 'Unable to upload the selected image.';
        this.toastr.error(message);
        this.isPhotoUploading = false;
      },
      complete: () => {
        this.isPhotoUploading = false;
      }
    });
  }

  clearPendingPhoto(): void {
    this.photoFile = null;
    this.clearPhotoPreviewUrl();
  }

  private setPhotoFile(file: File): void {
    if (!file.type || file.type.indexOf('image/') !== 0) {
      this.toastr.warning('Please choose an image file.');
      return;
    }

    if (file.size > this.maxPhotoBytes) {
      this.toastr.warning('Image must be 10MB or smaller.');
      return;
    }

    this.photoFile = file;
    this.clearPhotoPreviewUrl();
    this.photoPreviewUrl = URL.createObjectURL(file);
  }

  private clearPhotoPreviewUrl(): void {
    if (this.photoPreviewUrl) {
      URL.revokeObjectURL(this.photoPreviewUrl);
      this.photoPreviewUrl = null;
    }
  }

  updateForm(ancestorProfile: AncestorProfile) {
    this.ancestorProfileForm.patchValue({
      ancestorProfileId: ancestorProfile.ancestorProfileId,
      firstName: ancestorProfile.firstName,
      middleName: ancestorProfile.middleName,
      lastName: ancestorProfile.lastName,
      suffix: ancestorProfile.suffix,
      gender: ancestorProfile.gender,
      birthDate: ancestorProfile.birthDate,
      birthLocation: ancestorProfile.birthLocation,
      deathDate: ancestorProfile.deathDate,
      deathLocation: ancestorProfile.deathLocation,
      biography: ancestorProfile.biography,
      researchStatus: ancestorProfile.researchStatus,
      familyBranch: ancestorProfile.familyBranch,
      tags: ancestorProfile.tags,
      confidenceLevel: ancestorProfile.confidenceLevel,
      profilePhotoId: ancestorProfile.profilePhotoId
    });

    if (ancestorProfile.profilePhotoId) {
      this.ensureProfilePhotoVisible(ancestorProfile.profilePhotoId);
    }
  }

  private ensureProfilePhotoVisible(profilePhotoId: number): void {
    if (this.ancestorPhotos.some((photo) => photo.photoId === profilePhotoId)) {
      return;
    }

    this.photoService.get(profilePhotoId).subscribe((photo) => {
      if (!this.ancestorPhotos.some((ancestorPhoto) => ancestorPhoto.photoId === photo.photoId)) {
        this.ancestorPhotos.unshift(photo);
      }
    });
  }

  private loadAncestorPhotos(ancestorProfileId: number): void {
    this.ancestorProfileService.getPhotos(ancestorProfileId).subscribe((photos) => {
      this.ancestorPhotos = photos;

      const profilePhotoId = this.ancestorProfileForm.get('profilePhotoId')?.value;
      if (profilePhotoId) {
        this.ensureProfilePhotoVisible(profilePhotoId);
      }
    });
  }

  onSubmit() {
    const ancestorProfileCreate = new AncestorProfileCreate(
      this.ancestorProfileForm.get('ancestorProfileId')?.value,
      this.ancestorProfileForm.get('firstName')?.value,
      this.ancestorProfileForm.get('middleName')?.value,
      this.ancestorProfileForm.get('lastName')?.value,
      this.ancestorProfileForm.get('suffix')?.value,
      this.ancestorProfileForm.get('gender')?.value,
      this.ancestorProfileForm.get('birthDate')?.value,
      this.ancestorProfileForm.get('birthLocation')?.value,
      this.ancestorProfileForm.get('deathDate')?.value,
      this.ancestorProfileForm.get('deathLocation')?.value,
      this.ancestorProfileForm.get('biography')?.value,
      this.ancestorProfileForm.get('researchStatus')?.value,
      this.ancestorProfileForm.get('familyBranch')?.value,
      this.ancestorProfileForm.get('tags')?.value,
      this.ancestorProfileForm.get('confidenceLevel')?.value,
      this.ancestorProfileForm.get('profilePhotoId')?.value
    );

    this.ancestorProfileService.create(ancestorProfileCreate).subscribe((createdAncestorProfile) => {
      this.updateForm(createdAncestorProfile);
      this.toastr.info(`Ancestor profile saved.`);
      this.router.navigate([`/genealogy/ancestors/${createdAncestorProfile.ancestorProfileId}`]);
    });
  }
}