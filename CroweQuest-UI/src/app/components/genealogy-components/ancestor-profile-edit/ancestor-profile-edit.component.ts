import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AncestorProfileCreate } from 'src/app/models/genealogy/ancestor-profile-create.model';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';
import { AncestorProfileService } from 'src/app/services/genealogy/ancestor-profile.service';

@Component({
  selector: 'app-ancestor-profile-edit',
  templateUrl: './ancestor-profile-edit.component.html'
})
export class AncestorProfileEditComponent implements OnInit {
  ancestorProfileForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ancestorProfileService: AncestorProfileService,
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

    if (!!ancestorProfileId && ancestorProfileId !== -1) {
      this.ancestorProfileService.get(ancestorProfileId).subscribe((ancestorProfile) => this.updateForm(ancestorProfile));
    }
  }

  isNew() {
    return parseInt(this.ancestorProfileForm.get('ancestorProfileId')?.value) === -1;
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