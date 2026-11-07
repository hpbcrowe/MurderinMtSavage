import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';
import { SpouseEditSectionComponent } from './spouse-edit-section.component';

describe('SpouseEditSectionComponent', () => {
  let component: SpouseEditSectionComponent;
  let fixture: ComponentFixture<SpouseEditSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpouseEditSectionComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SpouseEditSectionComponent);
    component = fixture.componentInstance;
    formBuilder = new FormBuilder();

    component.ancestorProfileForm = formBuilder.group({
      gender: ['Male'],
      wifeAncestorProfileId: [null],
      husbandAncestorProfileId: [null]
    });
  });

  it('renders the spouse selector and updates the form when a spouse is selected', () => {
    component.eligibleSpouseAncestors = [new AncestorProfile(10, 'Anna', '', 'Crowe')];

    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.options.length).toBe(2);
    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.ancestorProfileForm.get('wifeAncestorProfileId')?.value).toBe(10);
  });

  it('uses wife field for male ancestor and husband field for female ancestor', () => {
    component.ancestorProfileForm.patchValue({ gender: 'Male' });
    expect(component.getSpouseSelectionField()).toBe('wifeAncestorProfileId');

    component.ancestorProfileForm.patchValue({ gender: 'Female' });
    expect(component.getSpouseSelectionField()).toBe('husbandAncestorProfileId');
  });

  it('prefers whichever spouse field already has a saved value', () => {
    component.ancestorProfileForm.patchValue({
      gender: 'Female',
      wifeAncestorProfileId: 10,
      husbandAncestorProfileId: null
    });
    expect(component.getSpouseSelectionField()).toBe('wifeAncestorProfileId');
    expect(component.getSpouseLabel()).toBe('Wife');

    component.ancestorProfileForm.patchValue({
      gender: 'Male',
      wifeAncestorProfileId: null,
      husbandAncestorProfileId: 20
    });
    expect(component.getSpouseSelectionField()).toBe('husbandAncestorProfileId');
    expect(component.getSpouseLabel()).toBe('Husband');
  });

  it('reports selected spouse based on active spouse field', () => {
    component.eligibleSpouseAncestors = [
      { ancestorProfileId: 10, firstName: 'Anna', middleName: '', lastName: 'Crowe' } as any,
      { ancestorProfileId: 20, firstName: 'John', middleName: '', lastName: 'Crowe' } as any
    ];

    component.ancestorProfileForm.patchValue({ gender: 'Male', wifeAncestorProfileId: null });
    expect(component.hasSelectedSpouse()).toBeFalse();

    component.ancestorProfileForm.patchValue({ wifeAncestorProfileId: 10 });
    expect(component.hasSelectedSpouse()).toBeTrue();

    component.ancestorProfileForm.patchValue({ gender: 'Female', wifeAncestorProfileId: null, husbandAncestorProfileId: null });
    expect(component.hasSelectedSpouse()).toBeFalse();

    component.ancestorProfileForm.patchValue({ husbandAncestorProfileId: 20 });
    expect(component.hasSelectedSpouse()).toBeTrue();
  });

  it('treats stale spouse IDs as not selected so create input remains available', () => {
    component.eligibleSpouseAncestors = [
      { ancestorProfileId: 100, firstName: 'Known', middleName: '', lastName: 'Spouse' } as any
    ];

    component.ancestorProfileForm.patchValue({
      gender: 'Male',
      wifeAncestorProfileId: 999
    });

    expect(component.hasSelectedSpouse()).toBeFalse();
  });

  it('highlights create wife button only when candidate name does not match an existing spouse option', () => {
    component.eligibleSpouseAncestors = [
      { ancestorProfileId: 11, firstName: 'Mary', middleName: '', lastName: 'Crowe' } as any
    ];

    component.newWifeName = 'M';
    expect(component.getWifeCreateButtonHighlighted()).toBeFalse();

    component.newWifeName = 'Mary Crowe';
    expect(component.getWifeCreateButtonHighlighted()).toBeFalse();

    component.newWifeName = 'Anna Crowe';
    expect(component.getWifeCreateButtonHighlighted()).toBeTrue();
  });

  it('highlights create husband button only when candidate name does not match an existing spouse option', () => {
    component.eligibleSpouseAncestors = [
      { ancestorProfileId: 12, firstName: 'John', middleName: 'A', lastName: 'Crowe' } as any
    ];

    component.newHusbandName = 'J';
    expect(component.getHusbandCreateButtonHighlighted()).toBeFalse();

    component.newHusbandName = 'John A Crowe';
    expect(component.getHusbandCreateButtonHighlighted()).toBeFalse();

    component.newHusbandName = 'Mark Crowe';
    expect(component.getHusbandCreateButtonHighlighted()).toBeTrue();
  });
});
