import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Source } from 'src/app/models/genealogy/source.model';
import { SourceCreate } from 'src/app/models/genealogy/source-create.model';
import { SourceService } from 'src/app/services/genealogy/source.service';

@Component({
  selector: 'app-source-edit',
  templateUrl: './source-edit.component.html'
})
export class SourceEditComponent implements OnInit {
  sourceForm!: FormGroup;
  uploadedFileName = '';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sourceService: SourceService,
    private toastr: ToastrService,
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Edit genealogy source and citation metadata' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      { name: 'keywords', content: 'Genealogy, Sources, Census, Records, OCR' }
    ]);
    this.title.setTitle('Edit Source');
  }

  ngOnInit(): void {
    const sourceId = parseInt(this.route.snapshot.paramMap.get('id')!);

    this.sourceForm = this.formBuilder.group({
      sourceId: [sourceId],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      sourceType: [''],
      citation: [''],
      description: [''],
      documentDate: [''],
      location: [''],
      repository: [''],
      attachedFileUrl: [''],
      fileId: [null]
    });

    if (!!sourceId && sourceId !== -1) {
      this.sourceService.get(sourceId).subscribe((source) => this.updateForm(source));
    }
  }

  isNew() {
    return parseInt(this.sourceForm.get('sourceId')?.value) === -1;
  }

  updateForm(source: Source) {
    this.sourceForm.patchValue({
      sourceId: source.sourceId,
      title: source.title,
      sourceType: source.sourceType,
      citation: source.citation,
      description: source.description,
      documentDate: source.documentDate,
      location: source.location,
      repository: source.repository,
      attachedFileUrl: source.attachedFileUrl,
      fileId: source.fileId
    });
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.uploadedFileName = file.name;
      this.sourceForm.patchValue({
        attachedFileUrl: file.name,
        description: this.sourceForm.get('description')?.value || `Dropped file: ${file.name}`
      });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.uploadedFileName = file.name;
      this.sourceForm.patchValue({
        attachedFileUrl: file.name,
        description: this.sourceForm.get('description')?.value || `Selected file: ${file.name}`
      });
    }
  }

  onSubmit() {
    const sourceCreate = new SourceCreate(
      this.sourceForm.get('sourceId')?.value,
      this.sourceForm.get('title')?.value,
      this.sourceForm.get('sourceType')?.value,
      this.sourceForm.get('citation')?.value,
      this.sourceForm.get('description')?.value,
      this.sourceForm.get('documentDate')?.value,
      this.sourceForm.get('location')?.value,
      this.sourceForm.get('repository')?.value,
      this.sourceForm.get('attachedFileUrl')?.value,
      this.sourceForm.get('fileId')?.value
    );

    this.sourceService.create(sourceCreate).subscribe((createdSource) => {
      this.updateForm(createdSource);
      this.toastr.info('Source saved.');
      this.router.navigate(['/genealogy/sources']);
    });
  }
}