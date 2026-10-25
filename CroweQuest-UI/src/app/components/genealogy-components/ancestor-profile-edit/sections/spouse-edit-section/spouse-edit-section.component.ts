import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';

@Component({
  selector: 'app-spouse-edit-section',
  templateUrl: './spouse-edit-section.component.html'
})
export class SpouseEditSectionComponent {
  @Input() ancestorProfileForm!: FormGroup;
  @Input() eligibleSpouseAncestors: AncestorProfile[] = [];

  @Input() newWifeName = '';
  @Input() newHusbandName = '';

  @Input() isCreatingWife = false;
  @Input() isCreatingHusband = false;

  @Input() recentlyCreatedWife: AncestorProfile | null = null;
  @Input() recentlyCreatedHusband: AncestorProfile | null = null;

  @Output() newWifeNameChange = new EventEmitter<string>();
  @Output() newHusbandNameChange = new EventEmitter<string>();

  @Output() clearSpouseSelection = new EventEmitter<void>();
  @Output() createAndAssignWife = new EventEmitter<void>();
  @Output() createAndAssignHusband = new EventEmitter<void>();
  @Output() openAncestorProfile = new EventEmitter<number>();

  getSpouseSelectionField(): 'wifeAncestorProfileId' | 'husbandAncestorProfileId' {
    return this.ancestorProfileForm.get('gender')?.value === 'Female' ? 'husbandAncestorProfileId' : 'wifeAncestorProfileId';
  }

  hasSelectedSpouse(): boolean {
    return !!this.ancestorProfileForm.get(this.getSpouseSelectionField())?.value;
  }
}
