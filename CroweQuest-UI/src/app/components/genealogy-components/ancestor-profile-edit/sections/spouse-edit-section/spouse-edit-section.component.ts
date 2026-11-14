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
    const wifeAncestorProfileId = Number(this.ancestorProfileForm.get('wifeAncestorProfileId')?.value);
    const husbandAncestorProfileId = Number(this.ancestorProfileForm.get('husbandAncestorProfileId')?.value);

    const hasWifeSelection = !Number.isNaN(wifeAncestorProfileId) && wifeAncestorProfileId > 0;
    const hasHusbandSelection = !Number.isNaN(husbandAncestorProfileId) && husbandAncestorProfileId > 0;

    if (hasWifeSelection && !hasHusbandSelection) {
      return 'wifeAncestorProfileId';
    }

    if (hasHusbandSelection && !hasWifeSelection) {
      return 'husbandAncestorProfileId';
    }

    return this.ancestorProfileForm.get('gender')?.value === 'Female' ? 'husbandAncestorProfileId' : 'wifeAncestorProfileId';
  }

  getSpouseLabel(): 'Wife' | 'Husband' | 'Spouse' {
    const selectedField = this.getSpouseSelectionField();

    if (selectedField === 'wifeAncestorProfileId') {
      return 'Wife';
    }

    if (selectedField === 'husbandAncestorProfileId') {
      return 'Husband';
    }

    return 'Spouse';
  }

  hasSelectedSpouse(): boolean {
    const spouseId = Number(this.ancestorProfileForm.get(this.getSpouseSelectionField())?.value);
    if (!spouseId || Number.isNaN(spouseId)) {
      return false;
    }

    return this.eligibleSpouseAncestors.some((ancestor) => ancestor.ancestorProfileId === spouseId);
  }

  getWifeCreateButtonHighlighted(): boolean {
    const candidateName = this.newWifeName.trim();
    if (!candidateName || candidateName.length < 2) {
      return false;
    }

    const matchingAncestor = this.eligibleSpouseAncestors.find((ancestor) => {
      const fullName = this.formatAncestorName(ancestor).toLowerCase();
      return fullName.includes(candidateName.toLowerCase());
    });

    return !matchingAncestor;
  }

  getHusbandCreateButtonHighlighted(): boolean {
    const candidateName = this.newHusbandName.trim();
    if (!candidateName || candidateName.length < 2) {
      return false;
    }

  
    const matchingAncestor = this.eligibleSpouseAncestors.find((ancestor) => {
      const fullName = this.formatAncestorName(ancestor).toLowerCase();
      return fullName.includes(candidateName.toLowerCase());
    });

    return !matchingAncestor;
  }

  private formatAncestorName(ancestor: AncestorProfile): string {
    return [ancestor.firstName, ancestor.middleName, ancestor.lastName].filter(Boolean).join(' ');
  }
}
