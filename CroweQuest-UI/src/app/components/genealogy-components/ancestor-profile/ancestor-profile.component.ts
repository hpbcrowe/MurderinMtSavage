import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';
import { AncestorRelationship } from 'src/app/models/genealogy/ancestor-relationship.model';
import { AncestorProfileService } from 'src/app/services/genealogy/ancestor-profile.service';

@Component({
  selector: 'app-ancestor-profile',
  templateUrl: './ancestor-profile.component.html'
})
export class AncestorProfileComponent implements OnInit {
  ancestorProfile!: AncestorProfile;
  relationshipForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private ancestorProfileService: AncestorProfileService,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Ancestor profile detail and relationships' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      { name: 'keywords', content: 'Genealogy, Ancestor, Family Tree, Research' }
    ]);
    this.title.setTitle('Ancestor Profile');
  }

  ngOnInit(): void {
    const ancestorProfileId = parseInt(this.route.snapshot.paramMap.get('id')!);

    this.relationshipForm = this.formBuilder.group({
      relatedAncestorProfileId: [null, Validators.required],
      relationshipType: ['Parent', Validators.required]
    });

    this.ancestorProfileService.get(ancestorProfileId).subscribe((ancestorProfile) => {
      this.ancestorProfile = ancestorProfile;
    });
  }

  follow(): void {
    this.ancestorProfileService.follow(this.ancestorProfile.ancestorProfileId).subscribe();
  }

  unfollow(): void {
    this.ancestorProfileService.unfollow(this.ancestorProfile.ancestorProfileId).subscribe();
  }

  addRelationship(): void {
    const relationship = new AncestorRelationship(
      0,
      this.ancestorProfile.ancestorProfileId,
      this.relationshipForm.get('relatedAncestorProfileId')?.value,
      this.relationshipForm.get('relationshipType')?.value
    );

    this.ancestorProfileService.addRelationship(this.ancestorProfile.ancestorProfileId, relationship).subscribe(() => {
      this.relationshipForm.reset({ relationshipType: 'Parent' });
    });
  }

  edit(): void {
    this.router.navigate([`/genealogy/ancestors/edit/${this.ancestorProfile.ancestorProfileId}`]);
  }
}