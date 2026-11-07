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
  @Input() currentAncestorProfile: AncestorProfile | null = null;

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

  // Helper methods
  // This is used to determine if a father has been selected in the form.
  //  It checks if the 'fatherAncestorProfileId' field in the ancestorProfileForm has a value.
  //  If it does, it returns true, indicating that a father has been selected; otherwise, 
  // it returns false.
  hasSelectedFather(): boolean {
    const fatherControl = this.ancestorProfileForm.get('fatherAncestorProfileId');
    if (fatherControl) {
      return !!fatherControl.value;
    }

    const savedValue = this.currentAncestorProfile?.fatherAncestorProfileId ?? this.currentAncestorProfile?.father?.ancestorProfileId;
    return !!savedValue;
  }

  get selectedFatherName(): string {
    const fatherControl = this.ancestorProfileForm.get('fatherAncestorProfileId');
    const selectedId = fatherControl
      ? fatherControl.value
      : this.currentAncestorProfile?.fatherAncestorProfileId ?? this.currentAncestorProfile?.father?.ancestorProfileId;
    const selectedFather = this.eligibleFatherAncestors.find((ancestor) =>
      this.compareAncestorId(ancestor.ancestorProfileId, selectedId)
    );

    if (selectedFather) {
      return this.formatAncestorName(selectedFather);
    }

    const savedFather = this.currentAncestorProfile?.father;
    return savedFather && this.compareAncestorId(savedFather.ancestorProfileId, selectedId)
      ? this.formatAncestorName(savedFather)
      : '';
  }

    // Helper methods
    // This is used to determine if a mother has been selected in the form.
    //  It checks if the 'motherAncestorProfileId' field in the ancestorProfileForm has a value.
    //  If it does, it returns true, indicating that a mother has been selected; otherwise, 
    // it returns false.
  hasSelectedMother(): boolean {
      const motherControl = this.ancestorProfileForm.get('motherAncestorProfileId');
      if (motherControl) {
        return !!motherControl.value;
      }

      const savedValue = this.currentAncestorProfile?.motherAncestorProfileId ?? this.currentAncestorProfile?.mother?.ancestorProfileId;
      return !!savedValue;
    }

  compareAncestorId = (optionValue: number | string | null | undefined, selectedValue: number | string | null | undefined): boolean => {
    const normalizedOption = this.normalizeId(optionValue);
    const normalizedSelected = this.normalizeId(selectedValue);
    return normalizedOption !== null && normalizedSelected !== null && normalizedOption === normalizedSelected;
  };

  private normalizeId(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const normalized = Number(value);
    return Number.isNaN(normalized) || normalized <= 0 ? null : normalized;
  }


// Helper methods
// This method checks if the "Create Father" button should be highlighted based on 
// the newFatherName input.
  getFatherCreateButtonHighlighted(): boolean {
    const candidateName = this.newFatherName.trim();
    if (!candidateName || candidateName.length < 2) {
      return false;
    }

   /**
    * matching ancestor check:
    * Check if the candidate name matches any existing eligible father
    * ancestor.
    * If no match is found, return true to highlight the create button.
    * If a match is found, return false to not highlight the create button.
    * 
    */
    const matchingAncestor = this.eligibleFatherAncestors.find((ancestor) => {
      const fullName = this.formatAncestorName(ancestor).toLowerCase();
      return fullName.includes(candidateName.toLowerCase());
    });

    return !matchingAncestor;
  }
// Helper methods
// This method checks if the "Create Mother" button should be highlighted based on 
// the newMotherName input.
  getMotherCreateButtonHighlighted(): boolean {
    const candidateName = this.newMotherName.trim();
    if (!candidateName || candidateName.length < 2) {
      return false;
    }

  /**
   * matching ancestor check:
   * Check if the candidate name matches any existing eligible mother ancestor.
   * If no match is found, return true to highlight the create button.
   * If a match is found, return false to not highlight the create button.
   */  
    const matchingAncestor = this.eligibleMotherAncestors.find((ancestor) => {
      const fullName = this.formatAncestorName(ancestor).toLowerCase();
      return fullName.includes(candidateName.toLowerCase());
    });

    return !matchingAncestor;
  }

/**
 * Formats the full name of an ancestor profile by concatenating the 
 * first name, middle name, and last name.
 *  
 * @param ancestor The ancestor profile object.
 * @returns The formatted full name of the ancestor.
 */
  private formatAncestorName(ancestor: Pick<AncestorProfile, 'firstName' | 'middleName' | 'lastName'>): string {
    return [ancestor.firstName, ancestor.middleName, ancestor.lastName].filter(Boolean).join(' ');
  }
}
