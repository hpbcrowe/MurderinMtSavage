import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ResearchNote } from 'src/app/models/genealogy/research-note.model';
import { ResearchNoteService } from 'src/app/services/genealogy/research-note.service';

@Component({
  selector: 'app-research-notes',
  templateUrl: './research-notes.component.html'
})
export class ResearchNotesComponent implements OnInit {
  researchNotes: ResearchNote[] = [];

  constructor(
    private researchNoteService: ResearchNoteService,
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Structured genealogy research notes' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      { name: 'keywords', content: 'Genealogy, Research Notes, Evidence, Family History' }
    ]);
    this.title.setTitle('Research Notes');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.researchNoteService.getAll().subscribe((researchNotes) => (this.researchNotes = researchNotes));
  }

  edit(researchNoteId: number): void {
    this.router.navigate([`/genealogy/research-notes/edit/${researchNoteId}`]);
  }

  createNew(): void {
    this.router.navigate(['/genealogy/research-notes/edit/-1']);
  }
}