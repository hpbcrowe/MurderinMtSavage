import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Source } from 'src/app/models/genealogy/source.model';
import { SourceService } from 'src/app/services/genealogy/source.service';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html'
})
export class SourcesComponent implements OnInit {
  sources: Source[] = [];

  constructor(
    private sourceService: SourceService,
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Genealogy source repository' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      { name: 'keywords', content: 'Genealogy, Sources, Census, Records, Research' }
    ]);
    this.title.setTitle('Sources');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.sourceService.getAll().subscribe((sources) => (this.sources = sources));
  }

  edit(sourceId: number): void {
    this.router.navigate([`/genealogy/sources/edit/${sourceId}`]);
  }

  createNew(): void {
    this.router.navigate(['/genealogy/sources/edit/-1']);
  }
}