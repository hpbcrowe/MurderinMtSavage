import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';
import { ResearchNote } from 'src/app/models/genealogy/research-note.model';
import { ResearchNoteCreate } from 'src/app/models/genealogy/research-note-create.model';
import { AncestorProfileService } from 'src/app/services/genealogy/ancestor-profile.service';
import { ResearchNoteService } from 'src/app/services/genealogy/research-note.service';

@Component({
  selector: 'app-research-note-edit',
  templateUrl: './research-note-edit.component.html'
})
export class ResearchNoteEditComponent implements OnInit {
  researchNoteForm!: FormGroup;
  ancestorProfiles: AncestorProfile[] = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private researchNoteService: ResearchNoteService,
    private ancestorProfileService: AncestorProfileService,
    private toastr: ToastrService,
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Edit genealogy research notes' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      { name: 'keywords', content: 'Genealogy, Research Notes, Evidence, Family History' }
    ]);
    this.title.setTitle('Edit Research Note');
  }

  ngOnInit(): void {
    const researchNoteId = parseInt(this.route.snapshot.paramMap.get('id')!);

    this.researchNoteForm = this.formBuilder.group({
      researchNoteId: [researchNoteId],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      ancestorProfileId: [null],
      status: ['Active Research'],
      confidenceLevel: ['Possible'],
      tags: ['']
    });

    this.ancestorProfileService.getAll().subscribe((ancestorProfiles) => (this.ancestorProfiles = ancestorProfiles));

    if (!!researchNoteId && researchNoteId !== -1) {
      this.researchNoteService.get(researchNoteId).subscribe((researchNote) => this.updateForm(researchNote));
    }
  }

  isNew() {
    return parseInt(this.researchNoteForm.get('researchNoteId')?.value) === -1;
  }

  updateForm(researchNote: ResearchNote) {
    this.researchNoteForm.patchValue({
      researchNoteId: researchNote.researchNoteId,
      title: researchNote.title,
      content: researchNote.content,
      ancestorProfileId: researchNote.ancestorProfileId,
      status: researchNote.status,
      confidenceLevel: researchNote.confidenceLevel,
      tags: researchNote.tags
    });
  }

  onSubmit() {
    const researchNoteCreate = new ResearchNoteCreate(
      this.researchNoteForm.get('researchNoteId')?.value,
      this.researchNoteForm.get('title')?.value,
      this.researchNoteForm.get('content')?.value,
      this.researchNoteForm.get('ancestorProfileId')?.value,
      this.researchNoteForm.get('status')?.value,
      this.researchNoteForm.get('confidenceLevel')?.value,
      this.researchNoteForm.get('tags')?.value
    );

    this.researchNoteService.create(researchNoteCreate).subscribe((createdResearchNote) => {
      this.updateForm(createdResearchNote);
      this.toastr.info('Research note saved.');
      this.router.navigate(['/genealogy/research-notes']);
    });
  }
}