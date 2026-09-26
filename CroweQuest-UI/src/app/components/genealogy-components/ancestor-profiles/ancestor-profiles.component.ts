import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';
import { AncestorProfileService } from 'src/app/services/genealogy/ancestor-profile.service';

@Component({
  selector: 'app-ancestor-profiles',
  templateUrl: './ancestor-profiles.component.html'
})
export class AncestorProfilesComponent implements OnInit {
  ancestorProfiles: AncestorProfile[] = [];
  searchTerm = '';

  constructor(
    private ancestorProfileService: AncestorProfileService,
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Ancestor profiles and genealogy research records' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      { name: 'keywords', content: 'Genealogy, Ancestors, Research, Family History, Crowe' }
    ]);
    this.title.setTitle('Ancestor Profiles');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.ancestorProfileService.getAll(this.searchTerm).subscribe((ancestorProfiles) => {
      this.ancestorProfiles = ancestorProfiles;
    });
  }

  edit(ancestorProfileId: number): void {
    this.router.navigate([`/genealogy/ancestors/edit/${ancestorProfileId}`]);
  }

  view(ancestorProfileId: number): void {
    this.router.navigate([`/genealogy/ancestors/${ancestorProfileId}`]);
  }

  createNew(): void {
    this.router.navigate(['/genealogy/ancestors/edit/-1']);
  }
}