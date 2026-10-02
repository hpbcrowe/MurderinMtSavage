import { Component, OnInit } from '@angular/core';
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
  allAncestors: AncestorProfile[] = [];
  recentlyCreatedWife: AncestorProfile | null = null;
  recentlyCreatedHusband: AncestorProfile | null = null;
  recentlyCreatedFather: AncestorProfile | null = null;
  recentlyCreatedMother: AncestorProfile | null = null;
  recentlyCreatedSibling: AncestorProfile | null = null;
  newHusbandName: string = '';
  newWifeName: string = '';
  newFatherName: string = '';
  newMotherName: string = '';
  newSiblingName: string = '';
  newSiblingGender: 'Male' | 'Female' = 'Male';
  selectedExistingSiblingId: number | null = null;
  isCreatingHusband: boolean = false;
  isCreatingWife: boolean = false;
  isCreatingFather: boolean = false;
  isCreatingMother: boolean = false;
  isCreatingSibling: boolean = false;
  userPhotos: Photo[] = [];
  ancestorPhotos: Photo[] = [];
  selectedUserPhotoId: number | null = null;
  selectedSiblingIds: number[] = [];
  private isSiblingRemovalClickInProgress = false;
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
      profilePhotoId: [null],
      husbandAncestorProfileId: [null],
      wifeAncestorProfileId: [null],
      fatherAncestorProfileId: [null],
      motherAncestorProfileId: [null],
      siblingAncestorProfileIds: [[]]
    });

    this.ancestorProfileService.getAll().subscribe((ancestors) => {
      this.allAncestors = ancestors;
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
    const siblingIds = (ancestorProfile.siblingAncestorProfileIds || [])
      .filter((id) => id !== ancestorProfile.fatherAncestorProfileId)
      .filter((id) => id !== ancestorProfile.motherAncestorProfileId);

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
      profilePhotoId: ancestorProfile.profilePhotoId,
      husbandAncestorProfileId: ancestorProfile.husbandAncestorProfileId,
      wifeAncestorProfileId: ancestorProfile.wifeAncestorProfileId,
      fatherAncestorProfileId: ancestorProfile.fatherAncestorProfileId,
      motherAncestorProfileId: ancestorProfile.motherAncestorProfileId,
      siblingAncestorProfileIds: siblingIds
    });

    this.selectedSiblingIds = [];

    const husbandId = ancestorProfile.husbandAncestorProfileId;
    const wifeId = ancestorProfile.wifeAncestorProfileId;
    const fatherId = ancestorProfile.fatherAncestorProfileId;
    const motherId = ancestorProfile.motherAncestorProfileId;

    this.newHusbandName = husbandId ? this.formatAncestorName(this.allAncestors.find((ancestor) => ancestor.ancestorProfileId === husbandId) || ancestorProfile) : '';
    this.newWifeName = wifeId ? this.formatAncestorName(this.allAncestors.find((ancestor) => ancestor.ancestorProfileId === wifeId) || ancestorProfile) : '';
    this.newFatherName = fatherId ? this.formatAncestorName(this.allAncestors.find((ancestor) => ancestor.ancestorProfileId === fatherId) || ancestorProfile) : '';
    this.newMotherName = motherId ? this.formatAncestorName(this.allAncestors.find((ancestor) => ancestor.ancestorProfileId === motherId) || ancestorProfile) : '';

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

  getCurrentAncestorProfileId(): number {
    const ancestorProfileId = parseInt(this.ancestorProfileForm.get('ancestorProfileId')?.value, 10);
    return isNaN(ancestorProfileId) ? -1 : ancestorProfileId;
  }

  getEligibleAncestors(): AncestorProfile[] {
    const currentAncestorProfileId = this.getCurrentAncestorProfileId();
    return this.allAncestors.filter((ancestor) => ancestor.ancestorProfileId !== currentAncestorProfileId);
  }

  getEligibleSpouseAncestors(): AncestorProfile[] {
    const currentGender = this.ancestorProfileForm.get('gender')?.value;

    if (currentGender === 'Male') {
      return this.getEligibleAncestors().filter((ancestor) => ancestor.gender === 'Female');
    }

    if (currentGender === 'Female') {
      return this.getEligibleAncestors().filter((ancestor) => ancestor.gender === 'Male');
    }

    return this.getEligibleAncestors().filter((ancestor) => ancestor.gender === 'Female' || ancestor.gender === 'Male');
  }

  getEligibleHusbandAncestors(): AncestorProfile[] {
    return this.ancestorProfileForm.get('gender')?.value === 'Female'
      ? this.getEligibleSpouseAncestors()
      : [];
  }

  getEligibleWifeAncestors(): AncestorProfile[] {
    return this.ancestorProfileForm.get('gender')?.value === 'Male'
      ? this.getEligibleSpouseAncestors()
      : [];
  }

  getEligibleFatherAncestors(): AncestorProfile[] {
    return this.getEligibleAncestors().filter((ancestor) => ancestor.gender === 'Male');
  }

  getEligibleMotherAncestors(): AncestorProfile[] {
    return this.getEligibleAncestors().filter((ancestor) => ancestor.gender === 'Female');
  }

  getSpouseSelectionField(): 'wifeAncestorProfileId' | 'husbandAncestorProfileId' {
    return this.ancestorProfileForm.get('gender')?.value === 'Female' ? 'husbandAncestorProfileId' : 'wifeAncestorProfileId';
  }

  getSiblingCandidateOptions(): AncestorProfile[] {
    const fatherId = this.ancestorProfileForm.get('fatherAncestorProfileId')?.value;
    const motherId = this.ancestorProfileForm.get('motherAncestorProfileId')?.value;
    const excludedIds = new Set<number>([
      fatherId,
      motherId,
      this.getCurrentAncestorProfileId()
    ].filter((id): id is number => !!id && !isNaN(id)));

    return this.getEligibleAncestors().filter((ancestor) => !excludedIds.has(ancestor.ancestorProfileId));
  }

  getCurrentSiblingAncestors(): AncestorProfile[] {
    const currentSiblingIds = new Set(this.getNormalizedIdList(this.ancestorProfileForm.get('siblingAncestorProfileIds')?.value ?? []));
    return this.allAncestors.filter((ancestor) => currentSiblingIds.has(ancestor.ancestorProfileId));
  }

  formatAncestorName(ancestor: AncestorProfile): string {
    return [ancestor.firstName, ancestor.middleName, ancestor.lastName].filter(Boolean).join(' ');
  }

  clearHusbandSelection(): void {
    this.ancestorProfileForm.patchValue({ husbandAncestorProfileId: null });
    this.newHusbandName = '';
  }

  clearWifeSelection(): void {
    this.ancestorProfileForm.patchValue({ wifeAncestorProfileId: null });
    this.newWifeName = '';
  }

  clearSpouseSelection(): void {
    const currentGender = this.ancestorProfileForm.get('gender')?.value;

    if (currentGender === 'Male') {
      this.clearWifeSelection();
      return;
    }

    if (currentGender === 'Female') {
      this.clearHusbandSelection();
      return;
    }

    this.clearHusbandSelection();
    this.clearWifeSelection();
  }

  clearFatherSelection(): void {
    this.ancestorProfileForm.patchValue({ fatherAncestorProfileId: null });
    this.newFatherName = '';
  }

  clearMotherSelection(): void {
    this.ancestorProfileForm.patchValue({ motherAncestorProfileId: null });
    this.newMotherName = '';
  }

  onSiblingSelectionChange(event?: Event): void {
    const selectedOptions = (event?.target as HTMLSelectElement | null)?.selectedOptions;

    if (!selectedOptions) {
      this.selectedSiblingIds = [];
      return;
    }

    this.selectedSiblingIds = Array.from(selectedOptions)
      .map((option) => this.getOptionNumericId(option as HTMLOptionElement))
      .filter((id) => !Number.isNaN(id));
  }

  private getOptionNumericId(option: HTMLOptionElement): number {
    const directValue = Number(option.value);
    if (!Number.isNaN(directValue)) {
      return directValue;
    }

    // Fallback for framework-generated option values like "number:123".
    const fallbackMatch = option.value.match(/(\d+)$/);
    return fallbackMatch ? Number(fallbackMatch[1]) : Number.NaN;
  }

  onSiblingSelectionBlur(event?: FocusEvent): void {
    if (this.isSiblingRemovalClickInProgress) {
      return;
    }

    const nextTarget = event?.relatedTarget as HTMLElement | null;
    const activeTarget = document.activeElement as HTMLElement | null;
    const siblingSelect = event?.target as HTMLSelectElement | null;
    const isMovingToRemoveButton = !!(
      (nextTarget && nextTarget.closest('.remove-sibling-button')) ||
      (activeTarget && activeTarget.closest('.remove-sibling-button'))
    );

    if (isMovingToRemoveButton) {
      return;
    }

    this.selectedSiblingIds = [];

    if (siblingSelect) {
      Array.from(siblingSelect.options).forEach((option) => {
        option.selected = false;
      });
    }
  }

  beginSiblingRemovalClick(): void {
    this.isSiblingRemovalClickInProgress = true;

    setTimeout(() => {
      this.isSiblingRemovalClickInProgress = false;
    });
  }

  clearSelectedSiblings(): void {
    const idsToRemove = this.getNormalizedIdList(this.selectedSiblingIds);

    if (!idsToRemove.length) {
      this.toastr.warning('No siblings selected to remove.');
      return;
    }

    if (!this.confirmSiblingRelationshipRemoval(idsToRemove)) {
      this.isSiblingRemovalClickInProgress = false;
      return;
    }

    const remainingSiblingIds = this.reconcileSiblingRelationshipIds(idsToRemove);

    this.isSiblingRemovalClickInProgress = false;
    this.selectedSiblingIds = [];
    this.ancestorProfileForm.patchValue({ siblingAncestorProfileIds: remainingSiblingIds });
    this.saveCurrentAncestorProfile(remainingSiblingIds);
    this.toastr.success(`Remaining ${remainingSiblingIds.length} sibling relationship(s).`);
  }

  private confirmSiblingRelationshipRemoval(idsToRemove: number[]): boolean {
    const selectedSiblingDetails = this.getSelectedSiblingDetailsForPrompt(idsToRemove);
    const currentAncestorName = this.getCurrentAncestorDisplayName();

    const message = selectedSiblingDetails.length === 1
      ? `Are you sure you want to remove ${selectedSiblingDetails[0]} from ${currentAncestorName}?`
      : `Are you sure you want to remove these sibling relationships from ${currentAncestorName}?\n\n${selectedSiblingDetails
          .map((detail, index) => `${index + 1}. ${detail}`)
          .join('\n')}`;

    return window.confirm(message);
  }

  private getSelectedSiblingDetailsForPrompt(idsToRemove: number[]): string[] {
    const siblingById = new Map(this.getCurrentSiblingAncestors().map((ancestor) => [ancestor.ancestorProfileId, ancestor]));

    return idsToRemove.map((id) => {
      const sibling = siblingById.get(id);

      if (!sibling) {
        return `sibling ID ${id}`;
      }

      const siblingName = this.formatAncestorName(sibling) || `sibling ID ${id}`;
      const relationshipLabel = sibling.gender === 'Male' ? 'brother' : sibling.gender === 'Female' ? 'sister' : 'sibling';

      return `${siblingName} as a ${relationshipLabel}`;
    });
  }

  private getCurrentAncestorDisplayName(): string {
    const firstName = this.ancestorProfileForm.get('firstName')?.value;
    const lastName = this.ancestorProfileForm.get('lastName')?.value;
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
    return fullName || 'this ancestor';
  }

  private reconcileSiblingRelationshipIds(idsToRemove: number[]): number[] {
    const fatherId = Number(this.ancestorProfileForm.get('fatherAncestorProfileId')?.value ?? 0);
    const motherId = Number(this.ancestorProfileForm.get('motherAncestorProfileId')?.value ?? 0);
    const currentSiblingIds = this.getNormalizedIdList(this.ancestorProfileForm.get('siblingAncestorProfileIds')?.value ?? []);

    const activeSiblingIds = currentSiblingIds.filter((id: number) => id !== fatherId && id !== motherId);
    const cleanedSiblingIds = activeSiblingIds.filter((id: number) => !idsToRemove.includes(id));

    return [...new Set(cleanedSiblingIds)];
  }

  private getNormalizedIdList(ids: unknown): number[] {
    const list = Array.isArray(ids) ? ids : ids == null ? [] : [ids];
    return list
      .map((id: number | string) => Number(id))
      .filter((id: number) => !Number.isNaN(id));
  }

  private saveCurrentAncestorProfile(siblingAncestorProfileIds?: number[]): void {
    const ancestorProfileId = this.getCurrentAncestorProfileId();
    if (ancestorProfileId <= 0) {
      return;
    }

    const ancestorProfileCreate = this.buildAncestorProfileCreateFromForm(siblingAncestorProfileIds);

    this.ancestorProfileService.create(ancestorProfileCreate).subscribe({
      next: (savedAncestorProfile) => this.updateForm(savedAncestorProfile),
      error: () => this.toastr.error('Unable to save sibling relationship changes.')
    });
  }

  private buildAncestorProfileCreateFromForm(siblingAncestorProfileIds?: number[]): AncestorProfileCreate {
    const currentSiblingIds = this.getNormalizedIdList(siblingAncestorProfileIds ?? this.ancestorProfileForm.get('siblingAncestorProfileIds')?.value ?? []);
    const fatherId = this.ancestorProfileForm.get('fatherAncestorProfileId')?.value;
    const motherId = this.ancestorProfileForm.get('motherAncestorProfileId')?.value;
    const husbandId = this.ancestorProfileForm.get('husbandAncestorProfileId')?.value;
    const wifeId = this.ancestorProfileForm.get('wifeAncestorProfileId')?.value;
    const filteredSiblingIds = currentSiblingIds.filter((id: number) => id !== Number(fatherId) && id !== Number(motherId));

    return new AncestorProfileCreate(
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
      this.ancestorProfileForm.get('profilePhotoId')?.value,
      husbandId,
      wifeId,
      [],
      fatherId,
      motherId,
      filteredSiblingIds
    );
  }

  getFatherCreateButtonHighlighted(): boolean {
    const candidateName = this.newFatherName.trim();
    if (!candidateName || candidateName.length < 2) {
      return false;
    }

    const matchingAncestor = this.getEligibleFatherAncestors().find((ancestor) => {
      const fullName = this.formatAncestorName(ancestor).toLowerCase();
      return fullName.includes(candidateName.toLowerCase());
    });

    return !matchingAncestor;
  }

  getMotherCreateButtonHighlighted(): boolean {
    const candidateName = this.newMotherName.trim();
    if (!candidateName || candidateName.length < 2) {
      return false;
    }

    const matchingAncestor = this.getEligibleMotherAncestors().find((ancestor) => {
      const fullName = this.formatAncestorName(ancestor).toLowerCase();
      return fullName.includes(candidateName.toLowerCase());
    });

    return !matchingAncestor;
  }

  createAndAssignFather(): void {
    const candidateName = this.newFatherName.trim();
    if (!candidateName) {
      this.toastr.warning('Enter a father name to create the ancestor.');
      return;
    }

    this.isCreatingFather = true;
    const fatherModel = this.buildNewAncestorCreateModel(candidateName, 'Male');

    this.ancestorProfileService.create(fatherModel).subscribe({
      next: (createdAncestor) => {
        this.upsertAncestorOption(createdAncestor);
        this.recentlyCreatedFather = createdAncestor;
        this.ancestorProfileForm.patchValue({
          fatherAncestorProfileId: createdAncestor.ancestorProfileId
        });
        this.newFatherName = '';
        this.toastr.success('Father ancestor created and selected.');
      },
      error: () => {
        this.toastr.error('Unable to create father ancestor.');
      },
      complete: () => {
        this.isCreatingFather = false;
      }
    });
  }

  createAndAssignMother(): void {
    const candidateName = this.newMotherName.trim();
    if (!candidateName) {
      this.toastr.warning('Enter a mother name to create the ancestor.');
      return;
    }

    this.isCreatingMother = true;
    const motherModel = this.buildNewAncestorCreateModel(candidateName, 'Female');

    this.ancestorProfileService.create(motherModel).subscribe({
      next: (createdAncestor) => {
        this.upsertAncestorOption(createdAncestor);
        this.recentlyCreatedMother = createdAncestor;
        this.ancestorProfileForm.patchValue({
          motherAncestorProfileId: createdAncestor.ancestorProfileId
        });
        this.newMotherName = '';
        this.toastr.success('Mother ancestor created and selected.');
      },
      error: () => {
        this.toastr.error('Unable to create mother ancestor.');
      },
      complete: () => {
        this.isCreatingMother = false;
      }
    });
  }

  addExistingSibling(): void {
    if (!this.selectedExistingSiblingId) {
      this.toastr.warning('Select an existing ancestor to add as a sibling.');
      return;
    }

    const nextSiblingIds = Array.from(new Set<number>([
      ...this.getNormalizedIdList(this.ancestorProfileForm.get('siblingAncestorProfileIds')?.value ?? []),
      this.selectedExistingSiblingId
    ]));

    this.ancestorProfileForm.patchValue({
      siblingAncestorProfileIds: nextSiblingIds
    });

    this.saveCurrentAncestorProfile(nextSiblingIds);
    this.selectedExistingSiblingId = null;
    this.toastr.success('Existing sibling added.');
  }

  createAndAddSibling(): void {
    const candidateName = this.newSiblingName.trim();
    if (!candidateName) {
      this.toastr.warning('Enter a sibling name to create the ancestor.');
      return;
    }

    this.isCreatingSibling = true;
    const siblingGender = this.newSiblingGender;
    const siblingModel = this.buildNewAncestorCreateModel(candidateName, siblingGender);

    this.ancestorProfileService.create(siblingModel).subscribe({
      next: (createdAncestor) => {
        this.upsertAncestorOption(createdAncestor);
        this.recentlyCreatedSibling = createdAncestor;

        const selectedSiblingIds = this.getNormalizedIdList(this.ancestorProfileForm.get('siblingAncestorProfileIds')?.value ?? []);
        const nextSiblingIds = Array.from(new Set<number>([...selectedSiblingIds, createdAncestor.ancestorProfileId]));

        this.ancestorProfileForm.patchValue({
          siblingAncestorProfileIds: nextSiblingIds
        });

        this.saveCurrentAncestorProfile(nextSiblingIds);

        this.newSiblingName = '';
        this.newSiblingGender = 'Male';
        this.toastr.success(`${siblingGender === 'Male' ? 'Brother' : 'Sister'} ancestor created and added.`);
      },
      error: () => {
        this.toastr.error('Unable to create sibling ancestor.');
      },
      complete: () => {
        this.isCreatingSibling = false;
      }
    });
  }

  private buildNewAncestorCreateModel(fullName: string, gender: string | null): AncestorProfileCreate {
    const splitName = this.splitFullName(fullName);

    return new AncestorProfileCreate(
      -1,
      splitName.firstName,
      splitName.middleName ?? undefined,
      splitName.lastName,
      undefined,
      gender || undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
     
      undefined,
      undefined,
     
    );
  }

  private splitFullName(fullName: string): { firstName: string; middleName: string | null; lastName: string } {
    const nameTokens = fullName
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => !!token);

    if (nameTokens.length === 0) {
      return { firstName: 'Unknown', middleName: null, lastName: 'Unknown' };
    }

    if (nameTokens.length === 1) {
      return { firstName: nameTokens[0], middleName: null, lastName: 'Unknown' };
    }

    const firstName = nameTokens[0];
    const lastName = nameTokens[nameTokens.length - 1];
    const middleNameTokens = nameTokens.slice(1, nameTokens.length - 1);
    const middleName = middleNameTokens.length > 0 ? middleNameTokens.join(' ') : null;

    return {
      firstName,
      middleName,
      lastName
    };
  }

  private upsertAncestorOption(ancestorProfile: AncestorProfile): void {
    const existingIndex = this.allAncestors.findIndex((ancestor) => ancestor.ancestorProfileId === ancestorProfile.ancestorProfileId);

    if (existingIndex >= 0) {
      this.allAncestors[existingIndex] = ancestorProfile;
      return;
    }

    this.allAncestors = [...this.allAncestors, ancestorProfile];
  }

  openAncestorProfile(ancestorProfileId: number): void {
    const profileUrl = this.router.serializeUrl(this.router.createUrlTree([`/genealogy/ancestors/${ancestorProfileId}`]));
    window.open(profileUrl, '_blank');
  }

  onSubmit() {
    const ancestorProfileCreate = this.buildAncestorProfileCreateFromForm();

    this.ancestorProfileService.create(ancestorProfileCreate).subscribe((createdAncestorProfile) => {
      this.updateForm(createdAncestorProfile);
      this.toastr.info(`Ancestor profile saved.`);
      this.router.navigate([`/genealogy/ancestors/${createdAncestorProfile.ancestorProfileId}`]);
    });
  }
}