import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';

@Component({
  selector: 'app-sibling-edit-section',
  templateUrl: './sibling-edit-section.component.html'
})
export class SiblingEditSectionComponent {
  @Input() currentSiblingAncestors: AncestorProfile[] = [];
  @Input() siblingCandidateOptions: AncestorProfile[] = [];

  @Input() isRemovingSibling = false;
  @Input() selectedExistingSiblingId: number | null = null;

  @Input() newSiblingName = '';
  @Input() newSiblingGender: 'Male' | 'Female' = 'Male';
  @Input() isCreatingSibling = false;

  @Input() recentlyCreatedSibling: AncestorProfile | null = null;
  @Output() removeSibling = new EventEmitter<number>();

  @Output() selectedExistingSiblingIdChange = new EventEmitter<number | null>();
  @Output() addExistingSibling = new EventEmitter<void>();

  @Output() newSiblingNameChange = new EventEmitter<string>();
  @Output() newSiblingGenderChange = new EventEmitter<'Male' | 'Female'>();
  @Output() createAndAddSibling = new EventEmitter<void>();

  @Output() openAncestorProfile = new EventEmitter<number>();
}
