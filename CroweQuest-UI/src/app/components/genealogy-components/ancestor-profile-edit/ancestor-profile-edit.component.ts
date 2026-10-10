import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AncestorProfileCreate } from 'src/app/models/genealogy/ancestor-profile-create.model';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';
import { AncestorRelationship } from 'src/app/models/genealogy/ancestor-relationship.model';
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

    /************************
    * Initialize the form with default values and validators.
    ************************/
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


/**
 * Load all ancestors and user photos for selection in the form. If an ancestorProfileId is provided,
 *  fetch the ancestor profile data and update the form accordingly.
 */
    this.ancestorProfileService.getAll().subscribe((ancestors) => {
      this.allAncestors = ancestors;
      this.refreshRelationshipDisplayNames();
    });

/**
 * Load all user photos for selection in the form. This allows the user to attach existing photos 
 * to the ancestor profile.
 */
    this.photoService.getByApplicationUserId().subscribe((userPhotos) => {
      this.userPhotos = userPhotos;
    });
/**
 * If an ancestorProfileId is provided and is valid, fetch the ancestor profile data and
 * update the form accordingly.
 */
    if (!!ancestorProfileId && ancestorProfileId !== -1) {
      this.ancestorProfileService.get(ancestorProfileId).subscribe((ancestorProfile) => {
        this.updateForm(ancestorProfile);
        this.loadAncestorPhotos(ancestorProfileId);
      });
    }
  }

/************************
* Cleanup logic when the component is destroyed.
************************/
  ngOnDestroy(): void {
    this.clearPhotoPreviewUrl();
  }

/**
 * 
 * Checks if the current ancestor profile is new (i.e., has an ID of -1).
 * @returns 
 * True if the ancestor profile is new; otherwise, false.
 */
  isNew() {
    return parseInt(this.ancestorProfileForm.get('ancestorProfileId')?.value) === -1;
  }
/**
 *  Retrieves the currently selected photo from the ancestor profile form.
 *  
 * @returns 
 * The selected Photo object if a photo is selected; otherwise, null.
 */
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

/**
 * Clears the currently selected profile photo in the ancestor profile form.
 * @returns 
 * void
 */
  clearProfilePhotoSelection(): void {
    this.ancestorProfileForm.patchValue({
      profilePhotoId: null
    });
  }


/**
 *  Retrieves the list of available user photos that can be attached to the ancestor profile.
 * @returns 
 * An array of Photo objects that are not currently attached to the ancestor profile.
 */
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


/**
 *    
 * @param photoId The ID of the photo to set as the profile photo.
 * @returns void
 *  
 */
  setProfilePhoto(photoId: number): void {
    this.ancestorProfileForm.patchValue({
      profilePhotoId: photoId
    });
  }

/**
 *  Attaches the currently selected existing user photo to the ancestor profile.
 * @returns 
 * void
 */
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


/**
 * Removes the specified photo from the ancestor profile.
 * @param photoId The ID of the photo to remove.
 * @returns void
 */
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


/**
 * Handles the change event from the photo picker input.
 * @param event The change event from the photo picker input.
 * @returns void
 */
  onPhotoPickerChange(event: any): void {
    const file = event?.target?.files?.[0];

    if (!file) {
      return;
    }

    this.setPhotoFile(file);
    event.target.value = '';
  }


/**
 *  Handles the dragover event for the photo drop area, preventing default behavior and 
 * indicating that a drag operation is active.
 * @param event The dragover event.
 * @returns void
 */
  onPhotoDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isPhotoDragActive = true;
  }


/**
 *  Handles the dragleave event for the photo drop area, preventing default behavior and 
 * indicating that a drag operation is no longer active.
 * @param event The dragleave event.
 * @returns void
 *  
 */
  onPhotoDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isPhotoDragActive = false;
  }

/**
 * Handles the drop event for the photo drop area, preventing default behavior and
 * indicating that a drag operation is no longer active.
 * @param event The drop event.
 * @returns void
 */
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


/**
 * Uploads the selected photo and attaches it to the ancestor profile.
 * @returns void
 */
  uploadPhotoAndAttach(): void {
    if (!this.photoFile || this.isPhotoUploading) {
      return;
    }


/**
 * Creates a FormData object, appends the selected photo file, and initiates the upload process.
 *  
 */
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


/**
 * Clears the pending photo selection and resets the photo preview URL.
 */
  clearPendingPhoto(): void {
    this.photoFile = null;
    this.clearPhotoPreviewUrl();
  }


/**
 * Sets the selected photo file and updates the photo preview URL.
 * @param file The selected photo file.
 * @returns void
 */
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


/**
 * Clears the photo preview URL and revokes the object URL to free up memory.
 * @returns void
 *  
 */
  private clearPhotoPreviewUrl(): void {
    if (this.photoPreviewUrl) {
      URL.revokeObjectURL(this.photoPreviewUrl);
      this.photoPreviewUrl = null;
    }
  }


/**
 *  Updates the ancestor profile form with the provided ancestor profile data.
 * @param ancestorProfile    *  
 * The AncestorProfile object containing the data to populate the form.
 */
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
/**
 *  Initializes the selected sibling IDs to an empty array. 
 * This is done to ensure that the form starts with no siblings selected, 
 * and any existing sibling relationships will be managed through the form controls. 
 */
    this.selectedSiblingIds = [];

    this.refreshRelationshipDisplayNames();

    if (ancestorProfile.profilePhotoId) {
      this.ensureProfilePhotoVisible(ancestorProfile.profilePhotoId);
    }
  }

  private refreshRelationshipDisplayNames(): void {
    this.newHusbandName = this.resolveRelationshipDisplayName(this.ancestorProfileForm.get('husbandAncestorProfileId')?.value);
    this.newWifeName = this.resolveRelationshipDisplayName(this.ancestorProfileForm.get('wifeAncestorProfileId')?.value);
    this.newFatherName = this.resolveRelationshipDisplayName(this.ancestorProfileForm.get('fatherAncestorProfileId')?.value);
    this.newMotherName = this.resolveRelationshipDisplayName(this.ancestorProfileForm.get('motherAncestorProfileId')?.value);
  }

  private resolveRelationshipDisplayName(ancestorProfileId: number | null | undefined): string {
    if (ancestorProfileId == null || Number.isNaN(Number(ancestorProfileId))) {
      return '';
    }

    const matchedAncestor = this.allAncestors.find((ancestor) => ancestor.ancestorProfileId === Number(ancestorProfileId));
    return matchedAncestor ? this.formatAncestorName(matchedAncestor) : '';
  }

/**
 *  Ensures that the profile photo with the specified ID is visible in the ancestor photos list.
 * @param profilePhotoId The ID of the profile photo to ensure visibility for.
 * @returns void
 */
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


/**
 *  Loads the photos for the specified ancestor profile.
 * @param ancestorProfileId The ID of the ancestor profile whose photos are to be loaded.
 * @returns void
 */
  private loadAncestorPhotos(ancestorProfileId: number): void {
    this.ancestorProfileService.getPhotos(ancestorProfileId).subscribe((photos) => {
      this.ancestorPhotos = photos;

      const profilePhotoId = this.ancestorProfileForm.get('profilePhotoId')?.value;
      if (profilePhotoId) {
        this.ensureProfilePhotoVisible(profilePhotoId);
      }
    });
  }


/**
 *  Retrieves the current ancestor profile ID from the form. 
 * If the ID is not a valid number, it returns -1.
 * @returns 
 * The current ancestor profile ID as a number, or -1 if the ID is invalid.
 */
  getCurrentAncestorProfileId(): number {
    const ancestorProfileId = parseInt(this.ancestorProfileForm.get('ancestorProfileId')?.value, 10);
    return isNaN(ancestorProfileId) ? -1 : ancestorProfileId;
  }


/**
 *  Retrieves a list of eligible ancestor profiles that can be selected as relatives,
 *  excluding the current ancestor profile.
 *  This is useful for ensuring that an ancestor cannot be selected as their own relative.
 * @returns A list of eligible ancestor profiles.
 *  
 */
  getEligibleAncestors(): AncestorProfile[] {
    const currentAncestorProfileId = this.getCurrentAncestorProfileId();
    return this.allAncestors.filter((ancestor) => ancestor.ancestorProfileId !== currentAncestorProfileId);
  }

/**
 *  Retrieves a list of eligible ancestor profiles that can be selected as spouses,
 *  based on the current ancestor's gender. 
 *  If the current ancestor is male, only female ancestors are eligible, and vice versa.
 *  If the gender is unspecified, all ancestors are eligible.
 * @returns A list of eligible ancestor profiles that can be selected as spouses. 
 *  
 */
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

/**
 *  Retrieves a list of eligible ancestor profiles that can be selected as husbands.
 * @returns A list of eligible ancestor profiles that can be selected as husbands.
 *  
 */
  getEligibleHusbandAncestors(): AncestorProfile[] {
    return this.ancestorProfileForm.get('gender')?.value === 'Female'
      ? this.getEligibleSpouseAncestors()
      : [];
  }

/**
 *  Retrieves a list of eligible ancestor profiles that can be selected as wives.
 * @returns A list of eligible ancestor profiles that can be selected as wives.
 *  
 */
  getEligibleWifeAncestors(): AncestorProfile[] {
    return this.ancestorProfileForm.get('gender')?.value === 'Male'
      ? this.getEligibleSpouseAncestors()
      : [];
  }


/**
 *  Retrieves a list of eligible ancestor profiles that can be selected as fathers.
 * @returns 
 * A list of eligible ancestor profiles that can be selected as fathers.
 */
  getEligibleFatherAncestors(): AncestorProfile[] {
    return this.getEligibleAncestors().filter((ancestor) => ancestor.gender === 'Male');
  }

  /**
   *  Retrieves a list of eligible ancestor profiles that can be selected as mothers.
   * @returns 
   * A list of eligible ancestor profiles that can be selected as mothers.
   */
  getEligibleMotherAncestors(): AncestorProfile[] {
    return this.getEligibleAncestors().filter((ancestor) => ancestor.gender === 'Female');
  }


/**
 *  Retrieves the appropriate spouse selection field based on the current ancestor's gender.
 * @returns 'wifeAncestorProfileId' if the current ancestor is male, 'husbandAncestorProfileId' if the current ancestor is female.
 */
  getSpouseSelectionField(): 'wifeAncestorProfileId' | 'husbandAncestorProfileId' {
    return this.ancestorProfileForm.get('gender')?.value === 'Female' ? 'husbandAncestorProfileId' : 'wifeAncestorProfileId';
  }

  hasSelectedSpouse(): boolean {
    const spouseField = this.getSpouseSelectionField();
    return !!this.ancestorProfileForm.get(spouseField)?.value;
  }

  hasSelectedFather(): boolean {
    return !!this.ancestorProfileForm.get('fatherAncestorProfileId')?.value;
  }

  hasSelectedMother(): boolean {
    return !!this.ancestorProfileForm.get('motherAncestorProfileId')?.value;
  }

  /**
   *  Retrieves a list of eligible ancestor profiles that can be selected as siblings.
   * @returns A list of eligible ancestor profiles that can be selected as siblings.
   *  A sibling cannot be the same as the current ancestor, their father, or their mother.
   *  This ensures that the sibling selection is valid and does not create circular relationships.
   */
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

/**
 *  Retrieves the list of currently selected sibling ancestor profiles based on the IDs stored in the form.
 * @returns 
 * An array of AncestorProfile objects representing the currently selected sibling ancestors.
 */
  getCurrentSiblingAncestors(): AncestorProfile[] {
    const currentSiblingIds = new Set(this.getNormalizedIdList(this.ancestorProfileForm.get('siblingAncestorProfileIds')?.value ?? []));
    return this.allAncestors.filter((ancestor) => currentSiblingIds.has(ancestor.ancestorProfileId));
  }

/**
 *  Normalizes a list of ancestor profile IDs by filtering out invalid or non-numeric values.
 * @param ids An array of ancestor profile IDs to normalize.
 * @returns A normalized array of ancestor profile IDs.
 * @param ancestor  The AncestorProfile object whose name is to be formatted.
 * @returns   A string representing the formatted name of the ancestor, combining first, middle, and last names.
 */
  formatAncestorName(ancestor: AncestorProfile): string {
    return [ancestor.firstName, ancestor.middleName, ancestor.lastName].filter(Boolean).join(' ');
  }


/*
* Clears the selected husband ancestor profile in the form and resets the new husband name.
* 
*/
  clearHusbandSelection(): void {
    this.ancestorProfileForm.patchValue({ husbandAncestorProfileId: null });
    this.newHusbandName = '';
  }

/* 
*Clears the selected wife ancestor profile in the form and resets the new wife name.
* 
*/
  clearWifeSelection(): void {
    this.ancestorProfileForm.patchValue({ wifeAncestorProfileId: null });
    this.newWifeName = '';
  }

/**
 * Clears the selected spouse ancestor profile in the form and resets the new spouse name.
 * @returns void
 *  
 */
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
/**
 * Clears the selected father ancestor profile in the form and resets the new father name.
 * @returns void
 */
  clearFatherSelection(): void {
    this.ancestorProfileForm.patchValue({ fatherAncestorProfileId: null });
    this.newFatherName = '';
  }

/**
 * Clears the selected mother ancestor profile in the form and resets the new mother name.
 * @returns void
 */
  clearMotherSelection(): void {
    this.ancestorProfileForm.patchValue({ motherAncestorProfileId: null });
    this.newMotherName = '';
  }

/**
 *  Handles the change event for sibling selection in the form. It updates the selectedSiblingIds 
 * array based on the selected options in the sibling selection dropdown.
 * @param event 
 * @returns   
 *    VOID
 */
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

  /***
   * Retrieves the numeric ID from a given HTMLOptionElement. It first attempts to parse the 
   * value directly as a number. If that fails, it uses a regex fallback to extract a numeric
   *  ID from framework-generated option values (e.g., "number:123").
   */
  private getOptionNumericId(option: HTMLOptionElement): number {
    const directValue = Number(option.value);
    if (!Number.isNaN(directValue)) {
      return directValue;
    }

    // Fallback for framework-generated option values like "number:123".
    const fallbackMatch = option.value.match(/(\d+)$/);
    return fallbackMatch ? Number(fallbackMatch[1]) : Number.NaN;
  }


/**
 *  Handles the blur event for sibling selection. It checks if the user is moving focus
 *  to a remove button, and if not, it clears the selected sibling IDs and deselects all
 *  options in the sibling selection dropdown.
 * @param event   
 * @returns void
 */
  onSiblingSelectionBlur(event?: FocusEvent): void {
    if (this.isSiblingRemovalClickInProgress) {
      return;
    }

// Check if the user is moving focus to a remove button. If so, do not clear the selection.
    const nextTarget = event?.relatedTarget as HTMLElement | null;
    const activeTarget = document.activeElement as HTMLElement | null;
    const siblingSelect = event?.target as HTMLSelectElement | null;

/**
 * Checks if the user is moving focus to a remove button. If so, do not clear the selection.
 * 
 */
    const isMovingToRemoveButton = !!(
      (nextTarget && nextTarget.closest('.remove-sibling-button')) ||
      (activeTarget && activeTarget.closest('.remove-sibling-button'))
    );

    if (isMovingToRemoveButton) {
      return;
    }

    this.selectedSiblingIds = [];

/**
 * Deselects all options in the sibling selection dropdown.
 */
    if (siblingSelect) {
      Array.from(siblingSelect.options).forEach((option) => {
        option.selected = false;
      });
    }
  }

/**
 * Handles the click event for the sibling removal button. It sets a flag to indicate that a 
 * sibling removal click is in progress, and resets the flag after a short delay to allow 
 * for proper handling of focus events.
 */
  beginSiblingRemovalClick(): void {
    this.isSiblingRemovalClickInProgress = true;

    setTimeout(() => {
      this.isSiblingRemovalClickInProgress = false;
    });
  }

/**
 * Clears the selected sibling IDs and updates the form accordingly.
 * @returns void
 */
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

// Reconcile the sibling relationship IDs by removing the selected sibling IDs from the current list.
    const remainingSiblingIds = this.reconcileSiblingRelationshipIds(idsToRemove);

// Update the form with the remaining sibling IDs and save the changes.
    this.isSiblingRemovalClickInProgress = false;
    this.selectedSiblingIds = [];
    this.ancestorProfileForm.patchValue({ siblingAncestorProfileIds: remainingSiblingIds });
    this.saveCurrentAncestorProfile(remainingSiblingIds);
    this.toastr.success(`Remaining ${remainingSiblingIds.length} sibling relationship(s).`);
  }

 /**
  *   Confirms with the user before removing sibling relationships. It constructs a confirmation message
  * @param idsToRemove  
  * @returns boolean indicating whether the user confirmed the removal.
  */ 
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
/**
 *  Constructs a list of sibling details for the confirmation prompt based on the provided IDs to remove.
 * @param idsToRemove   
 * @returns   An array of strings representing the details of the siblings to be removed, formatted for 
 * display in the confirmation prompt.
 */
  private getSelectedSiblingDetailsForPrompt(idsToRemove: number[]): string[] {
    const siblingById = new Map(this.getCurrentSiblingAncestors().map((ancestor) => [ancestor.ancestorProfileId, ancestor]));

    return idsToRemove.map((id) => {
      const sibling = siblingById.get(id);

      if (!sibling) {
        return `sibling ID ${id}`;
      }

// Format the sibling's name and relationship label for display in the confirmation prompt.
      const siblingName = this.formatAncestorName(sibling) || `sibling ID ${id}`;
      const relationshipLabel = sibling.gender === 'Male' ? 'brother' : sibling.gender === 'Female' ? 'sister' : 'sibling';

      return `${siblingName} as a ${relationshipLabel}`;
    });
  }
/**
 *  Retrieves the display name of the current ancestor based on the first and last name fields in the form.
 * @returns   A string representing the display name of the current ancestor, or 'this ancestor' 
 * if no name is provided.
 */
  private getCurrentAncestorDisplayName(): string {
    const firstName = this.ancestorProfileForm.get('firstName')?.value;
    const lastName = this.ancestorProfileForm.get('lastName')?.value;
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
    return fullName || 'this ancestor';
  }

/**
 *  Reconciles the sibling relationship IDs by removing the specified IDs from the current list of
 * sibling IDs in the form.
 * @param idsToRemove 
 * @returns   An array of numbers representing the updated list of sibling IDs after removal.
 */
  private reconcileSiblingRelationshipIds(idsToRemove: number[]): number[] {
    const fatherId = Number(this.ancestorProfileForm.get('fatherAncestorProfileId')?.value ?? 0);
    const motherId = Number(this.ancestorProfileForm.get('motherAncestorProfileId')?.value ?? 0);
    const currentSiblingIds = this.getNormalizedIdList(this.ancestorProfileForm.get('siblingAncestorProfileIds')?.value ?? []);

    const activeSiblingIds = currentSiblingIds.filter((id: number) => id !== fatherId && id !== motherId);
    const cleanedSiblingIds = activeSiblingIds.filter((id: number) => !idsToRemove.includes(id));

    return [...new Set(cleanedSiblingIds)];
  }

/**
 *  Normalizes a list of IDs by converting them to numbers and filtering out invalid values.
 * @param ids   The input list of IDs, which can be an array, a single value, or null/undefined.
 * @returns   An array of valid numbers representing the normalized IDs.
 */
  private getNormalizedIdList(ids: unknown): number[] {
    const list = Array.isArray(ids) ? ids : ids == null ? [] : [ids];
    return list
      .map((id: number | string) => Number(id))
      .filter((id: number) => !Number.isNaN(id));
  }


/**
 *  Saves the current ancestor profile, optionally updating the sibling relationships.
 * @param siblingAncestorProfileIds   An optional array of sibling ancestor profile IDs to 
 * associate with the current ancestor.
 * @returns   void
 */  
  private saveCurrentAncestorProfile(siblingAncestorProfileIds?: number[]): void {
    const ancestorProfileId = this.getCurrentAncestorProfileId();
    if (ancestorProfileId <= 0) {
      return;
    }

// Build the AncestorProfileCreate object from the form data, including any updated sibling relationships.
    const ancestorProfileCreate = this.buildAncestorProfileCreateFromForm(siblingAncestorProfileIds);

// Call the ancestorProfileService to save the changes, and handle the response.
    this.ancestorProfileService.create(ancestorProfileCreate).subscribe({
      next: (savedAncestorProfile) => this.updateForm(savedAncestorProfile),
      error: () => this.toastr.error('Unable to save sibling relationship changes.')
    });
  }

/**
 *  Builds an AncestorProfileCreate object from the current form data, optionally including a list of 
 * sibling ancestor profile IDs.
 * @param siblingAncestorProfileIds   An optional array of sibling ancestor profile IDs to include in the created object.
 * @returns   An AncestorProfileCreate object representing the current form data.
 */
  private buildAncestorProfileCreateFromForm(siblingAncestorProfileIds?: number[]): AncestorProfileCreate {
    const currentSiblingIds = this.getNormalizedIdList(siblingAncestorProfileIds ?? this.ancestorProfileForm.get('siblingAncestorProfileIds')?.value ?? []);
    const fatherId = this.ancestorProfileForm.get('fatherAncestorProfileId')?.value;
    const motherId = this.ancestorProfileForm.get('motherAncestorProfileId')?.value;
    const husbandId = this.ancestorProfileForm.get('husbandAncestorProfileId')?.value;
    const wifeId = this.ancestorProfileForm.get('wifeAncestorProfileId')?.value;
    const filteredSiblingIds = currentSiblingIds.filter((id: number) => id !== Number(fatherId) && id !== Number(motherId));

// Create and return a new AncestorProfileCreate object with the form values and relationships.
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


/**
 *  Determines whether the "Create Father" button should be highlighted based on the current input
 *  in the newFatherName field. 
 *  
 * @returns   A boolean indicating whether the "Create Father" button should be highlighted.
 */
  getFatherCreateButtonHighlighted(): boolean {
    const candidateName = this.newFatherName.trim();
    if (!candidateName || candidateName.length < 2) {
      return false;
    }

// Check if any existing eligible father ancestor's name includes the candidate name (case-insensitive).
    const matchingAncestor = this.getEligibleFatherAncestors().find((ancestor) => {
      const fullName = this.formatAncestorName(ancestor).toLowerCase();
      return fullName.includes(candidateName.toLowerCase());
    });

    return !matchingAncestor;
  }

/** 
 * Determines whether the "Create Mother" button should be highlighted based on the current input
 *  in the newMotherName field. 
 *  
 * @returns   A boolean indicating whether the "Create Mother" button should be highlighted.
 */
  getMotherCreateButtonHighlighted(): boolean {
    const candidateName = this.newMotherName.trim();
    if (!candidateName || candidateName.length < 2) {
      return false;
    }

/**
 * Check if any existing eligible mother ancestor's name includes the candidate name (case-insensitive).
 *  If a matching ancestor is found, the button will not be highlighted; otherwise, it will be. 
 */
    const matchingAncestor = this.getEligibleMotherAncestors().find((ancestor) => {
      const fullName = this.formatAncestorName(ancestor).toLowerCase();
      return fullName.includes(candidateName.toLowerCase());
    });

    return !matchingAncestor;
  }


/**
 * Creates a new husband ancestor and assigns it to the current ancestor profile.
 * @returns void
 */
   createAndAssignHusband(): void {
    const candidateName = this.newHusbandName.trim();
    if (!candidateName) {
      this.toastr.warning('Enter a husband name to create the ancestor.');
      return;
    }
// Set the flag to indicate that a husband creation process is in progress.
    this.isCreatingHusband = true;
    const husbandModel = this.buildNewAncestorCreateModel(candidateName, 'Male');
// Call the ancestorProfileService to create the new husband ancestor and handle the response.
    this.ancestorProfileService.create(husbandModel).subscribe({
      next: (createdAncestor) => {
        this.upsertAncestorOption(createdAncestor);
        this.ancestorProfileForm.patchValue({
          husbandAncestorProfileId: createdAncestor.ancestorProfileId
        });
        this.saveCurrentAncestorProfile();
        this.linkCreatedSpouseToCurrentAncestor(createdAncestor, 'husband');
        this.recentlyCreatedHusband = createdAncestor;
// Reset the new husband name field and display a success message.
        this.newHusbandName = '';
        this.toastr.success('Husband ancestor created and selected.');
      },
// Handle any errors that occur during the creation process and display an error message.
      error: () => {
        this.toastr.error('Unable to create husband ancestor.');
      },
// Reset the flag to indicate that the husband creation process has completed.
      complete: () => {
        this.isCreatingHusband = false;
      }
    });
  }

/**
 *  Creates a new wife ancestor and assigns it to the current ancestor profile.
 * @returns   void
 *  
 */
   createAndAssignWife(): void {
    const candidateName = this.newWifeName.trim();
    if (!candidateName) {
      this.toastr.warning('Enter a wife name to create the ancestor.');
      return;
    }

// Set the flag to indicate that a wife creation process is in progress.
    this.isCreatingWife = true;

// Build the AncestorProfileCreate model for the new wife ancestor.
    const wifeModel = this.buildNewAncestorCreateModel(candidateName, 'Female');

// Call the ancestorProfileService to create the new wife ancestor and handle the response.
    this.ancestorProfileService.create(wifeModel).subscribe({
      next: (createdAncestor) => {
        this.upsertAncestorOption(createdAncestor);
        this.ancestorProfileForm.patchValue({
          wifeAncestorProfileId: createdAncestor.ancestorProfileId
        });
        this.saveCurrentAncestorProfile();
        this.linkCreatedSpouseToCurrentAncestor(createdAncestor, 'wife');
        this.recentlyCreatedWife = createdAncestor;

// Reset the new wife name field and display a success message.
        this.newWifeName = '';
        this.toastr.success('Wife ancestor created and selected.');
      },

// Handle any errors that occur during the creation process and display an error message.
      error: () => {
        this.toastr.error('Unable to create wife ancestor.');
      },

// Reset the flag to indicate that the wife creation process has completed.
      complete: () => {
        this.isCreatingWife = false;
      }
    });
  }

  private linkCreatedSpouseToCurrentAncestor(createdSpouse: AncestorProfile, spouseType: 'wife' | 'husband'): void {
    const currentAncestorId = this.getCurrentAncestorProfileId();

    if (currentAncestorId <= 0) {
      this.toastr.info('Save the current ancestor first to create a reciprocal spouse link.');
      return;
    }

    const spouseUpdateModel = spouseType === 'wife'
      ? this.buildAncestorProfileCreateFromAncestor(createdSpouse, currentAncestorId, createdSpouse.wifeAncestorProfileId)
      : this.buildAncestorProfileCreateFromAncestor(createdSpouse, createdSpouse.husbandAncestorProfileId, currentAncestorId);

    this.ancestorProfileService.create(spouseUpdateModel).subscribe({
      next: (updatedSpouse) => {
        this.upsertAncestorOption(updatedSpouse);
        this.linkCurrentAncestorChildrenToSpouse(updatedSpouse.ancestorProfileId);

        if (spouseType === 'wife') {
          this.recentlyCreatedWife = updatedSpouse;
        } else {
          this.recentlyCreatedHusband = updatedSpouse;
        }
      },
      error: () => {
        this.toastr.warning('Spouse ancestor was created, but the reciprocal spouse link could not be saved.');
      }
    });
  }

  private getCurrentAncestorChildIds(): number[] {
    const currentAncestorId = this.getCurrentAncestorProfileId();
    if (currentAncestorId <= 0) {
      return [];
    }

    const directChildren = this.allAncestors
      .filter((ancestor) => ancestor.ancestorProfileId !== currentAncestorId &&
        (ancestor.fatherAncestorProfileId === currentAncestorId || ancestor.motherAncestorProfileId === currentAncestorId))
      .map((ancestor) => Number(ancestor.ancestorProfileId))
      .filter((id) => !Number.isNaN(id) && id > 0);

    const currentAncestor = this.allAncestors.find((ancestor) => ancestor.ancestorProfileId === currentAncestorId);
    const childrenFromLoadedProfile = (currentAncestor?.children ?? [])
      .map((child) => Number(child.ancestorProfileId))
      .filter((id) => !Number.isNaN(id) && id > 0);

    return Array.from(new Set([...directChildren, ...childrenFromLoadedProfile]));
  }

  private getAncestorChildIds(ancestorProfileId: number): number[] {
    const matchedAncestor = this.allAncestors.find((ancestor) => ancestor.ancestorProfileId === ancestorProfileId);

    const childIds = (matchedAncestor?.children ?? [])
      .map((child) => Number(child.ancestorProfileId))
      .filter((id) => !Number.isNaN(id) && id > 0);

    const inferredChildren = this.allAncestors
      .filter((ancestor) => ancestor.ancestorProfileId !== ancestorProfileId &&
        (ancestor.fatherAncestorProfileId === ancestorProfileId || ancestor.motherAncestorProfileId === ancestorProfileId))
      .map((ancestor) => Number(ancestor.ancestorProfileId))
      .filter((id) => !Number.isNaN(id) && id > 0);

    return Array.from(new Set([...childIds, ...inferredChildren]));
  }

  private linkCurrentAncestorChildrenToSpouse(spouseAncestorProfileId: number | null | undefined): void {
    if (!spouseAncestorProfileId || spouseAncestorProfileId <= 0) {
      return;
    }

    const currentAncestorId = this.getCurrentAncestorProfileId();
    if (currentAncestorId <= 0) {
      return;
    }

    const currentChildIds = this.getCurrentAncestorChildIds();
    if (!currentChildIds.length) {
      return;
    }

    const spouseChildIds = new Set(this.getAncestorChildIds(spouseAncestorProfileId));
    const childIdsToAttach = currentChildIds.filter((childId) => !spouseChildIds.has(childId));

    childIdsToAttach.forEach((childId) => {
      const relationship = new AncestorRelationship(0, spouseAncestorProfileId, childId, 'Parent');
      this.ancestorProfileService.addRelationship(spouseAncestorProfileId, relationship).subscribe({
        error: () => {
          this.toastr.warning('The spouse was linked, but one of the child relationships could not be saved.');
        }
      });
    });
  }

/**
 *  Creates a new father ancestor and assigns it to the current ancestor profile.
 * @returns 
 *  void
 */

  createAndAssignFather(): void {
    const candidateName = this.newFatherName.trim();
    if (!candidateName) {
      this.toastr.warning('Enter a father name to create the ancestor.');
      return;
    }

// Set the flag to indicate that a father creation process is in progress.
    this.isCreatingFather = true;

// Build the AncestorProfileCreate model for the new father ancestor.
    const fatherModel = this.buildNewAncestorCreateModel(candidateName, 'Male');

// Call the ancestorProfileService to create the new father ancestor and handle the response.
    this.ancestorProfileService.create(fatherModel).subscribe({
      next: (createdAncestor) => {
        this.upsertAncestorOption(createdAncestor);
        this.recentlyCreatedFather = createdAncestor;
        this.ancestorProfileForm.patchValue({
          fatherAncestorProfileId: createdAncestor.ancestorProfileId
        });

// Reset the new father name field and display a success message.
        this.newFatherName = '';
        this.toastr.success('Father ancestor created and selected.');
      },

// Handle any errors that occur during the creation process and display an error message.
      error: () => {
        this.toastr.error('Unable to create father ancestor.');
      },

// Reset the flag to indicate that the father creation process has completed.
      complete: () => {
        this.isCreatingFather = false;
      }
    });
  }


/**
 *  Creates a new mother ancestor and assigns it to the current ancestor profile.
 * @returns 
 *  void
 */
  createAndAssignMother(): void {
    const candidateName = this.newMotherName.trim();
    if (!candidateName) {
      this.toastr.warning('Enter a mother name to create the ancestor.');
      return;
    }

// Set the flag to indicate that a mother creation process is in progress.
    this.isCreatingMother = true;

// Build the AncestorProfileCreate model for the new mother ancestor.
    const motherModel = this.buildNewAncestorCreateModel(candidateName, 'Female');

// Call the ancestorProfileService to create the new mother ancestor and handle the response.
    this.ancestorProfileService.create(motherModel).subscribe({
      next: (createdAncestor) => {
        this.upsertAncestorOption(createdAncestor);
        this.recentlyCreatedMother = createdAncestor;
        this.ancestorProfileForm.patchValue({
          motherAncestorProfileId: createdAncestor.ancestorProfileId
        });

// Reset the new mother name field and display a success message.
        this.newMotherName = '';
        this.toastr.success('Mother ancestor created and selected.');
      },

// Handle any errors that occur during the creation process and display an error message.
      error: () => {
        this.toastr.error('Unable to create mother ancestor.');
      },

// Reset the flag to indicate that the mother creation process has completed.
      complete: () => {
        this.isCreatingMother = false;
      }
    });
  }

/**
 *  Adds an existing ancestor as a sibling to the current ancestor profile. It checks if 
 * an existing sibling ID is selected, updates the form with the new list of sibling IDs,
 *  and saves the changes. If no existing sibling is selected, it displays a warning message.
 * @returns void
 */
  addExistingSibling(): void {
    if (!this.selectedExistingSiblingId) {
      this.toastr.warning('Select an existing ancestor to add as a sibling.');
      return;
    }

/**
 * Combines the current list of sibling ancestor profile IDs with the selected existing sibling ID,
 * ensuring that there are no duplicates, and updates the form with the new list of sibling IDs.  
 *   
 */
    const nextSiblingIds = Array.from(new Set<number>([
      ...this.getNormalizedIdList(this.ancestorProfileForm.get('siblingAncestorProfileIds')?.value ?? []),
      this.selectedExistingSiblingId
    ]));

// Save the updated list of sibling IDs to the current ancestor profile and reset the selected 
//  existing sibling ID.
    this.ancestorProfileForm.patchValue({
      siblingAncestorProfileIds: nextSiblingIds
    });

//  Save the current ancestor profile with the updated sibling relationships and display a success message.
    this.saveCurrentAncestorProfile(nextSiblingIds);
    this.selectedExistingSiblingId = null;
    this.toastr.success('Existing sibling added.');
  }

/**
 *  Creates a new sibling ancestor and adds it to the current ancestor profile. It checks if a
 * sibling name is provided, builds a new ancestor model, and calls the ancestorProfileService to create it. 
 * Upon successful creation, it updates the form with the new sibling ID and saves the changes. 
 * @returns   
 *  VOID  
 */
  createAndAddSibling(): void {
    const candidateName = this.newSiblingName.trim();
    if (!candidateName) {
      this.toastr.warning('Enter a sibling name to create the ancestor.');
      return;
    }

//  Set the flag to indicate that a sibling creation process is in progress.
    this.isCreatingSibling = true;
    const siblingGender = this.newSiblingGender;
    const siblingModel = this.buildNewAncestorCreateModel(candidateName, siblingGender);

//  Call the ancestorProfileService to create the new sibling ancestor and handle the response.
      this.ancestorProfileService.create(siblingModel).subscribe({
      next: (createdAncestor) => {
        this.upsertAncestorOption(createdAncestor);
        this.recentlyCreatedSibling = createdAncestor;

//  Retrieve the current list of sibling ancestor profile IDs, add the newly created sibling's ID,
//  and update the form with the new list of sibling IDs.
        const selectedSiblingIds = this.getNormalizedIdList(this.ancestorProfileForm.get('siblingAncestorProfileIds')?.value ?? []);
        const nextSiblingIds = Array.from(new Set<number>([...selectedSiblingIds, createdAncestor.ancestorProfileId]));

        this.ancestorProfileForm.patchValue({
          siblingAncestorProfileIds: nextSiblingIds
        });

//  Save the current ancestor profile with the updated sibling relationships and display a success message.
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

/**
 *  Builds a new AncestorProfileCreate model based on the provided full name and gender.  
 * @param fullName 
 * @param gender 
 * @returns   
 *    An AncestorProfileCreate object with the specified name and gender, ready for creation.
 */
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

  private buildAncestorProfileCreateFromAncestor(
    ancestor: AncestorProfile,
    husbandAncestorProfileId?: number,
    wifeAncestorProfileId?: number
  ): AncestorProfileCreate {
    return new AncestorProfileCreate(
      ancestor.ancestorProfileId,
      ancestor.firstName,
      ancestor.middleName,
      ancestor.lastName,
      ancestor.suffix,
      ancestor.gender,
      ancestor.birthDate,
      ancestor.birthLocation,
      ancestor.deathDate,
      ancestor.deathLocation,
      ancestor.biography,
      ancestor.researchStatus,
      ancestor.familyBranch,
      ancestor.tags,
      ancestor.confidenceLevel,
      ancestor.profilePhotoId,
      husbandAncestorProfileId,
      wifeAncestorProfileId,
      [],
      ancestor.fatherAncestorProfileId,
      ancestor.motherAncestorProfileId,
      this.getNormalizedIdList(ancestor.siblingAncestorProfileIds ?? [])
    );
  }


/**
 *  Splits a full name string into its constituent parts: first name, middle name, and last name.
 *  If the full name is empty or invalid, it defaults to "Unknown" for first and last names.  
 * @param fullName 
 * @returns   
 *   An object containing the first name, middle name (or null if not present), and last name.
 */
  private splitFullName(fullName: string): { firstName: string; middleName: string | null; lastName: string } {
  // Split the full name into tokens, trimming whitespace and filtering out empty tokens.
    const nameTokens = fullName
      .split(' ')
      .map((token) => token.trim())
//  Filter out any empty tokens to ensure that only valid name parts are considered.
      .filter((token) => !!token);

// Handle cases where the name is empty or consists of a single token.
    if (nameTokens.length === 0) {
      return { firstName: 'Unknown', middleName: null, lastName: 'Unknown' };
    }

//  Handle cases where the name consists of a single token, treating it as the first name
//  and defaulting the last name to "Unknown".
    if (nameTokens.length === 1) {
      return { firstName: nameTokens[0], middleName: null, lastName: 'Unknown' };
    }

//  For names with multiple tokens, assign the first token as the first name, 
// the last token as the last name,
//  and join any intermediate tokens as the middle name (if present).
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

  /**
   *  Adds or updates an ancestor profile in the allAncestors array. If the ancestor profile 
   * already exists (based on ancestorProfileId), it updates the existing entry; otherwise, 
   * it adds the new ancestor profile to the array.
   * @param ancestorProfile 
   * @returns 
   *    VOID
   */
  private upsertAncestorOption(ancestorProfile: AncestorProfile): void {
    const existingIndex = this.allAncestors.findIndex((ancestor) => ancestor.ancestorProfileId === ancestorProfile.ancestorProfileId);
// If the ancestor profile already exists, update it; otherwise, add it to the array.
    if (existingIndex >= 0) {
      this.allAncestors[existingIndex] = ancestorProfile;
      return;
    }
// If the ancestor profile does not exist, add it to the array.
    this.allAncestors = [...this.allAncestors, ancestorProfile];
  }

/**
 *  Opens the ancestor profile in a new browser tab based on the provided ancestorProfileId.
 * @param ancestorProfileId The ID of the ancestor profile to open.
 */
  openAncestorProfile(ancestorProfileId: number): void {
    const profileUrl = this.router.serializeUrl(this.router.createUrlTree([`/genealogy/ancestors/${ancestorProfileId}`]));
    window.open(profileUrl, '_blank');
  }

  onSubmit() {
    const ancestorProfileCreate = this.buildAncestorProfileCreateFromForm();

    this.ancestorProfileService.create(ancestorProfileCreate).subscribe((createdAncestorProfile) => {
      this.updateForm(createdAncestorProfile);
      const spouseId = this.ancestorProfileForm.get('gender')?.value === 'Male'
        ? createdAncestorProfile.wifeAncestorProfileId
        : createdAncestorProfile.husbandAncestorProfileId;

      if (spouseId) {
        this.linkCurrentAncestorChildrenToSpouse(spouseId);
      }

      this.toastr.info(`Ancestor profile saved.`);
      this.router.navigate([`/genealogy/ancestors/${createdAncestorProfile.ancestorProfileId}`]);
    });
  }
}