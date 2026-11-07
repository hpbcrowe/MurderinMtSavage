import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';

@Component({
  selector: 'app-sibling-edit-section',
  templateUrl: './sibling-edit-section.component.html'
})
export class SiblingEditSectionComponent {
  @Input() currentSiblingAncestors: AncestorProfile[] = [];
  @Input() siblingCandidateOptions: AncestorProfile[] = [];

  @Input() selectedSiblingIds: number[] = [];
  @Input() selectedExistingSiblingId: number | null = null;

  @Input() newSiblingName = '';
  @Input() newSiblingGender: 'Male' | 'Female' = 'Male';
  @Input() isCreatingSibling = false;

  @Input() recentlyCreatedSibling: AncestorProfile | null = null;
  private isSiblingRemovalClickInProgress = false;

  @Output() selectedSiblingIdsChange = new EventEmitter<number[]>();
  @Output() clearSelectedSiblings = new EventEmitter<number[]>();

  @Output() selectedExistingSiblingIdChange = new EventEmitter<number | null>();
  @Output() addExistingSibling = new EventEmitter<void>();

  @Output() newSiblingNameChange = new EventEmitter<string>();
  @Output() newSiblingGenderChange = new EventEmitter<'Male' | 'Female'>();
  @Output() createAndAddSibling = new EventEmitter<void>();

  @Output() openAncestorProfile = new EventEmitter<number>();

  onSiblingSelectionChange(event?: Event): void {
    const selectedOptions = (event?.target as HTMLSelectElement | null)?.selectedOptions;

    if (!selectedOptions) {
      this.selectedSiblingIds = [];
      this.selectedSiblingIdsChange.emit([]);
      return;
    }

    const selectedIds = Array.from(selectedOptions)
      .map((option) => this.getOptionNumericId(option as HTMLOptionElement))
      .filter((id) => !Number.isNaN(id));

    this.selectedSiblingIds = selectedIds;
    this.selectedSiblingIdsChange.emit(selectedIds);
  }

  onSiblingSelectionBlur(event?: FocusEvent): void {
    if (this.isSiblingRemovalClickInProgress) {
      return;
    }

    const nextTarget = event?.relatedTarget as HTMLElement | null;
    const activeTarget = document.activeElement as HTMLElement | null;
    const siblingSelect = event?.target as HTMLSelectElement | null;

    const isMovingToRemoveButton = !!(
      (nextTarget && nextTarget.closest('.remove-sibling-button')) ||
      (activeTarget && activeTarget.closest('.remove-sibling-button'))
    );

    if (isMovingToRemoveButton) {
      return;
    }

    this.selectedSiblingIds = [];
    this.selectedSiblingIdsChange.emit([]);

    if (siblingSelect) {
      Array.from(siblingSelect.options).forEach((option) => {
        option.selected = false;
      });
    }
  }

  beginSiblingRemovalClick(): void {
    this.isSiblingRemovalClickInProgress = true;

    setTimeout(() => {
      this.isSiblingRemovalClickInProgress = false;
    });
  }

  requestClearSelectedSiblings(): void {
    this.clearSelectedSiblings.emit([...this.selectedSiblingIds]);
  }

  private getOptionNumericId(option: HTMLOptionElement): number {
    const directValue = Number(option.value);
    if (!Number.isNaN(directValue)) {
      return directValue;
    }

    const fallbackMatch = option.value.match(/(\d+)$/);
    return fallbackMatch ? Number(fallbackMatch[1]) : Number.NaN;
  }
}
