import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';
import { Photo } from 'src/app/models/photo/photo.model';
import { AncestorProfileService } from 'src/app/services/genealogy/ancestor-profile.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-ancestor-profile',
  templateUrl: './ancestor-profile.component.html'
})
export class AncestorProfileComponent implements OnInit {
  ancestorProfile!: AncestorProfile;
  profilePhoto: Photo | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ancestorProfileService: AncestorProfileService,
    private photoService: PhotoService,
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
    this.route.paramMap.subscribe((params) => {
      const ancestorProfileId = parseInt(params.get('id') ?? '', 10);

      if (Number.isNaN(ancestorProfileId)) {
        return;
      }

      this.loadAncestorProfile(ancestorProfileId);
    });
  }

  private loadAncestorProfile(ancestorProfileId: number): void {
    this.ancestorProfileService.get(ancestorProfileId).subscribe((ancestorProfile) => {
      this.ancestorProfile = ancestorProfile;
      this.profilePhoto = null;

      if (ancestorProfile.profilePhotoId) {
        this.photoService.get(ancestorProfile.profilePhotoId).subscribe((photo) => {
          this.profilePhoto = photo;
        });
      }
    });
  }

  follow(): void {
    this.ancestorProfileService.follow(this.ancestorProfile.ancestorProfileId).subscribe();
  }

  unfollow(): void {
    this.ancestorProfileService.unfollow(this.ancestorProfile.ancestorProfileId).subscribe();
  }

  edit(): void {
    this.router.navigate([`/genealogy/ancestors/edit/${this.ancestorProfile.ancestorProfileId}`]);
  }
}