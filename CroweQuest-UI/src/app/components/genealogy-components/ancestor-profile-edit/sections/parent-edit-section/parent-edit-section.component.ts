import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';

@Component({
  selector: 'app-parent-edit-section',
  templateUrl: './parent-edit-section.component.html'
})
export class ParentEditSectionComponent {
  @Input() ancestorProfileForm!: FormGroup;

  @Input() eligibleFatherAncestors: AncestorProfile[] = [];
  @Input() eligibleMotherAncestors: AncestorProfile[] = [];

  @Input() newFatherName = '';
  @Input() newMotherName = '';

  @Input() isCreatingFather = false;
  @Input() isCreatingMother = false;

  @Input() recentlyCreatedFather: AncestorProfile | null = null;
  @Input() recentlyCreatedMother: AncestorProfile | null = null;

  @Output() newFatherNameChange = new EventEmitter<string>();
  @Output() newMotherNameChange = new EventEmitter<string>();

  @Output() clearFatherSelection = new EventEmitter<void>();
  @Output() clearMotherSelection = new EventEmitter<void>();

  @Output() createAndAssignFather = new EventEmitter<void>();
  @Output() createAndAssignMother = new EventEmitter<void>();

  @Output() openAncestorProfile = new EventEmitter<number>();

  hasSelectedFather(): boolean {
    return !!this.ancestorProfileForm.get('fatherAncestorProfileId')?.value;
  }

  hasSelectedMother(): boolean {
    return !!this.ancestorProfileForm.get('motherAncestorProfileId')?.value;
  }

  getFatherCreateButtonHighlighted(): boolean {
    const candidateName = this.newFatherName.trim();
    if (!candidateName || candidateName.length < 2) {
      return false;
    }

    const matchingAncestor = this.eligibleFatherAncestors.find((ancestor) => {
      const fullName = this.formatAncestorName(ancestor).toLowerCase();
      return fullName.includes(candidateName.toLowerCase());
    });

    return !matchingAncestor;
  }

  getMotherCreateButtonHighlighted(): boolean {
    const candidateName = this.newMotherName.trim();
    if (!candidateName || candidateName.length < 2) {
      return false;
    }

    const matchingAncestor = this.eligibleMotherAncestors.find((ancestor) => {
      const fullName = this.formatAncestorName(ancestor).toLowerCase();
      return fullName.includes(candidateName.toLowerCase());
    });

    return !matchingAncestor;
  }

  private formatAncestorName(ancestor: AncestorProfile): string {
    return [ancestor.firstName, ancestor.middleName, ancestor.lastName].filter(Boolean).join(' ');
  }
}
