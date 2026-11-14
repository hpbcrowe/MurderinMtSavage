import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SiblingEditSectionComponent } from './sibling-edit-section.component';

describe('SiblingEditSectionComponent', () => {
  let component: SiblingEditSectionComponent;
  let fixture: ComponentFixture<SiblingEditSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiblingEditSectionComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SiblingEditSectionComponent);
    component = fixture.componentInstance;
  });

  it('parses selected sibling IDs from multiple select options', () => {
    const emittedValues: number[][] = [];
    component.selectedSiblingIdsChange.subscribe((value) => emittedValues.push(value));

    const optionOne = document.createElement('option');
    optionOne.value = '10';
    optionOne.selected = true;

    const optionTwo = document.createElement('option');
    optionTwo.value = 'number:20';
    optionTwo.selected = true;

    const select = document.createElement('select');
    select.multiple = true;
    select.append(optionOne, optionTwo);
    Object.defineProperty(select, 'selectedOptions', {
      configurable: true,
      value: [optionOne, optionTwo]
    });

    component.onSiblingSelectionChange({ target: select } as unknown as Event);

    expect(component.selectedSiblingIds).toEqual([10, 20]);
    expect(emittedValues.pop()).toEqual([10, 20]);
  });

  it('clears sibling selection on blur when not moving to remove button', () => {
    const emittedValues: number[][] = [];
    component.selectedSiblingIdsChange.subscribe((value) => emittedValues.push(value));

    const optionOne = document.createElement('option');
    optionOne.selected = true;
    const optionTwo = document.createElement('option');
    optionTwo.selected = true;
    const select = document.createElement('select');
    select.append(optionOne, optionTwo);

    component.selectedSiblingIds = [10, 20];
    component.onSiblingSelectionBlur({ target: select, relatedTarget: null } as unknown as FocusEvent);

    expect(component.selectedSiblingIds).toEqual([]);
    expect(emittedValues.pop()).toEqual([]);
    expect(optionOne.selected).toBeFalse();
    expect(optionTwo.selected).toBeFalse();
  });

  it('keeps sibling selection when blur moves focus to remove button', () => {
    jasmine.clock().install();

    const button = document.createElement('button');
    button.classList.add('remove-sibling-button');

    component.selectedSiblingIds = [10, 20];
    component.beginSiblingRemovalClick();

    component.onSiblingSelectionBlur({ target: document.createElement('select'), relatedTarget: button } as unknown as FocusEvent);

    expect(component.selectedSiblingIds).toEqual([10, 20]);

    jasmine.clock().tick(0);
    jasmine.clock().uninstall();
  });

  it('emits selected IDs when remove is requested', () => {
    const emittedValues: number[][] = [];
    component.clearSelectedSiblings.subscribe((value) => emittedValues.push(value));

    component.selectedSiblingIds = [10, 20];
    component.requestClearSelectedSiblings();

    expect(emittedValues).toEqual([[10, 20]]);
  });
});
