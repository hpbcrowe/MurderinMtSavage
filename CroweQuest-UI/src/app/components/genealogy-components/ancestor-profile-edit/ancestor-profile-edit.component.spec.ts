import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AncestorProfileEditComponent } from './ancestor-profile-edit.component';
import { ParentEditSectionComponent } from './sections/parent-edit-section/parent-edit-section.component';
import { AncestorProfileService } from 'src/app/services/genealogy/ancestor-profile.service';
import { PhotoService } from 'src/app/services/photo.service';

describe('AncestorProfileEditComponent', () => {
  let component: AncestorProfileEditComponent;
  let formBuilder: FormBuilder;

  const makeObservableStub = (value: any) => ({
    subscribe: (handlerOrObject: any) => {
      const callback = typeof handlerOrObject === 'function' ? handlerOrObject : handlerOrObject?.next;
      if (typeof callback === 'function') {
        callback(value);
      }
      return { unsubscribe: () => undefined };
    }
  });

  beforeEach(() => {
    formBuilder = new FormBuilder();

    component = new AncestorProfileEditComponent(
      { snapshot: { paramMap: { get: () => '1' } } } as unknown as ActivatedRoute,
      formBuilder,
      {} as AncestorProfileService,
      {} as PhotoService,
      { info: jasmine.createSpy('info'), warning: jasmine.createSpy('warning'), error: jasmine.createSpy('error'), success: jasmine.createSpy('success') } as unknown as ToastrService,
      { navigate: jasmine.createSpy('navigate'), createUrlTree: jasmine.createSpy('createUrlTree'), serializeUrl: jasmine.createSpy('serializeUrl') } as unknown as Router,
      { addTags: jasmine.createSpy('addTags') } as unknown as Meta,
      { setTitle: jasmine.createSpy('setTitle') } as unknown as Title
    );

    component.ancestorProfileForm = formBuilder.group({
      siblingAncestorProfileIds: [[10, 20, 30]]
    });
  });

  it('limits spouse options to the opposite gender of the current ancestor', () => {
    component.ancestorProfileForm = formBuilder.group({
      ancestorProfileId: [1],
      gender: ['Male']
    });

    component.allAncestors = [
      { ancestorProfileId: 1, gender: 'Male', firstName: 'A', lastName: 'One' },
      { ancestorProfileId: 2, gender: 'Male', firstName: 'B', lastName: 'Two' },
      { ancestorProfileId: 3, gender: 'Female', firstName: 'C', lastName: 'Three' },
      { ancestorProfileId: 4, gender: 'Female', firstName: 'D', lastName: 'Four' },
      { ancestorProfileId: 5, gender: 'Unknown', firstName: 'E', lastName: 'Five' }
    ] as any;

    expect(component.getEligibleSpouseAncestors().map((ancestor) => ancestor.ancestorProfileId)).toEqual([3, 4]);

    component.ancestorProfileForm.patchValue({ gender: 'Female' });

    expect(component.getEligibleSpouseAncestors().map((ancestor) => ancestor.ancestorProfileId)).toEqual([2]);
  });

  it('includes currently selected spouse and parents in displayed option lists even when they do not meet current gender filters', () => {
    component.ancestorProfileForm = formBuilder.group({
      ancestorProfileId: [1],
      gender: ['Male'],
      wifeAncestorProfileId: [4],
      husbandAncestorProfileId: [null],
      fatherAncestorProfileId: [2],
      motherAncestorProfileId: [3]
    });

    component.allAncestors = [
      { ancestorProfileId: 1, gender: 'Male', firstName: 'Current', lastName: 'Ancestor' },
      { ancestorProfileId: 2, gender: 'Unknown', firstName: 'Father', lastName: 'Unknown' },
      { ancestorProfileId: 3, gender: 'Unknown', firstName: 'Mother', lastName: 'Unknown' },
      { ancestorProfileId: 4, gender: 'Unknown', firstName: 'Spouse', lastName: 'Unknown' },
      { ancestorProfileId: 5, gender: 'Female', firstName: 'Eligible', lastName: 'Wife' }
    ] as any;

    expect(component.getDisplayedSpouseAncestors().map((ancestor) => ancestor.ancestorProfileId)).toContain(4);
    expect(component.getDisplayedFatherAncestors().map((ancestor) => ancestor.ancestorProfileId)).toContain(2);
    expect(component.getDisplayedMotherAncestors().map((ancestor) => ancestor.ancestorProfileId)).toContain(3);
  });

  it('includes database-backed parent relationships in the displayed options even when the form control is empty', () => {
    component.ancestorProfileForm = formBuilder.group({
      ancestorProfileId: [99],
      fatherAncestorProfileId: [null],
      motherAncestorProfileId: [null]
    });

    component.currentAncestorProfile = {
      ancestorProfileId: 99,
      firstName: 'Current',
      lastName: 'Ancestor',
      gender: 'Male',
      fatherAncestorProfileId: 11,
      motherAncestorProfileId: 12,
      father: { ancestorProfileId: 11, displayName: 'Father Person' },
      mother: { ancestorProfileId: 12, displayName: 'Mother Person' }
    } as any;

    component.allAncestors = [
      { ancestorProfileId: 11, gender: 'Male', firstName: 'Father', lastName: 'Person' },
      { ancestorProfileId: 12, gender: 'Female', firstName: 'Mother', lastName: 'Person' }
    ] as any;

    expect(component.getDisplayedFatherAncestors().map((ancestor) => ancestor.ancestorProfileId)).toContain(11);
    expect(component.getDisplayedMotherAncestors().map((ancestor) => ancestor.ancestorProfileId)).toContain(12);
  });

  it('normalizes parent IDs from the API so Angular can match the selected option instead of showing Unknown', () => {
    component.ancestorProfileForm = formBuilder.group({
      ancestorProfileId: [99],
      fatherAncestorProfileId: [null],
      motherAncestorProfileId: [null]
    });

    component.currentAncestorProfile = {
      ancestorProfileId: 99,
      firstName: 'Current',
      lastName: 'Ancestor',
      gender: 'Male',
      fatherAncestorProfileId: '9',
      motherAncestorProfileId: '12',
      father: { ancestorProfileId: 9, firstName: 'Father', lastName: 'Example', gender: 'Male' },
      mother: { ancestorProfileId: 12, firstName: 'Mother', lastName: 'Example', gender: 'Female' }
    } as any;

    component.allAncestors = [
      { ancestorProfileId: 9, gender: 'Male', firstName: 'Father', lastName: 'Example' },
      { ancestorProfileId: 12, gender: 'Female', firstName: 'Mother', lastName: 'Example' }
    ] as any;

    component.updateForm(component.currentAncestorProfile as any);

    expect(component.ancestorProfileForm.get('fatherAncestorProfileId')?.value).toBe(9);
    expect(component.ancestorProfileForm.get('motherAncestorProfileId')?.value).toBe(12);
    expect(component.getDisplayedFatherAncestors().some((ancestor) => ancestor.ancestorProfileId === 9)).toBeTrue();
    expect(component.getDisplayedMotherAncestors().some((ancestor) => ancestor.ancestorProfileId === 12)).toBeTrue();
    expect(component.getDisplayedFatherAncestors().find((ancestor) => ancestor.ancestorProfileId === 9)?.firstName).toBe('Father');
  });

  it('matches persisted database IDs to the option value even when one side is a string and the other is a number', () => {
    const parentSection = new ParentEditSectionComponent();
    parentSection.ancestorProfileForm = formBuilder.group({
      fatherAncestorProfileId: [9],
      motherAncestorProfileId: [12]
    });

    expect(parentSection.compareAncestorId(9, '9')).toBeTrue();
    expect(parentSection.compareAncestorId(12, '12')).toBeTrue();
    expect(parentSection.compareAncestorId(9, '10')).toBeFalse();
  });

  it('leaves relationship fields blank when no matching spouse or parent record is in the list', () => {
    component.allAncestors = [];
    component.updateForm({
      ancestorProfileId: 99,
      firstName: 'Current',
      middleName: '',
      lastName: 'Ancestor',
      suffix: '',
      gender: 'Male',
      birthDate: null,
      birthLocation: '',
      deathDate: null,
      deathLocation: '',
      biography: '',
      researchStatus: 'Researching',
      familyBranch: '',
      tags: '',
      confidenceLevel: 'Possible',
      profilePhotoId: null,
      husbandAncestorProfileId: null,
      wifeAncestorProfileId: 10,
      fatherAncestorProfileId: 11,
      motherAncestorProfileId: 12,
      siblingAncestorProfileIds: []
    } as any);

    expect(component.newWifeName).toBe('');
    expect(component.newFatherName).toBe('');
    expect(component.newMotherName).toBe('');
  });

  it('keeps the in-memory ancestor cache and selected sibling state in sync after a save', () => {
    component.allAncestors = [
      { ancestorProfileId: 99, firstName: 'Old', lastName: 'Name', gender: 'Male', siblingAncestorProfileIds: [10] } as any
    ];

    component.updateForm({
      ancestorProfileId: 99,
      firstName: 'Updated',
      middleName: '',
      lastName: 'Name',
      suffix: '',
      gender: 'Male',
      birthDate: null,
      birthLocation: '',
      deathDate: null,
      deathLocation: '',
      biography: '',
      researchStatus: 'Researching',
      familyBranch: '',
      tags: '',
      confidenceLevel: 'Possible',
      profilePhotoId: null,
      husbandAncestorProfileId: null,
      wifeAncestorProfileId: 200,
      fatherAncestorProfileId: 11,
      motherAncestorProfileId: 12,
      siblingAncestorProfileIds: [10, 20]
    } as any);

    expect(component.allAncestors.find((ancestor) => ancestor.ancestorProfileId === 99)?.firstName).toBe('Updated');
    expect(component.selectedSiblingIds).toEqual([10, 20]);
  });

  it('saves the current ancestor immediately after creating and selecting a mother', () => {
    component.ancestorProfileForm = formBuilder.group({
      ancestorProfileId: [100],
      firstName: ['Current'],
      lastName: ['Ancestor'],
      middleName: [''],
      suffix: [''],
      gender: ['Male'],
      birthDate: [''],
      birthLocation: [''],
      deathDate: [''],
      deathLocation: [''],
      biography: [''],
      researchStatus: ['Researching'],
      familyBranch: [''],
      tags: [''],
      confidenceLevel: ['Possible'],
      profilePhotoId: [null],
      husbandAncestorProfileId: [null],
      wifeAncestorProfileId: [null],
      fatherAncestorProfileId: [null],
      motherAncestorProfileId: [null],
      siblingAncestorProfileIds: [[]]
    });

    const createSpy = jasmine.createSpy('create').and.callFake((model: any) => {
      if (model.ancestorProfileId === -1) {
        return makeObservableStub({
          ancestorProfileId: 11,
          firstName: 'Emma',
          middleName: '',
          lastName: 'Stokes',
          gender: 'Female'
        });
      }

      return makeObservableStub({
        ...model,
        ancestorProfileId: 100,
        firstName: 'Current',
        lastName: 'Ancestor'
      });
    });

    component['ancestorProfileService'] = { create: createSpy } as any;
    component.newMotherName = 'Emma Stokes';

    component.createAndAssignMother();

    expect(createSpy.calls.count()).toBe(2);
    expect(createSpy.calls.mostRecent().args[0].motherAncestorProfileId).toBe(11);
  });

  it('normalizes api datetime strings so date inputs show saved values in edit mode', () => {
    component.ancestorProfileForm = formBuilder.group({
      ancestorProfileId: [99],
      firstName: [''],
      middleName: [''],
      lastName: [''],
      suffix: [''],
      gender: [''],
      birthDate: [''],
      birthLocation: [''],
      deathDate: [''],
      deathLocation: [''],
      biography: [''],
      researchStatus: [''],
      familyBranch: [''],
      tags: [''],
      confidenceLevel: [''],
      profilePhotoId: [null],
      husbandAncestorProfileId: [null],
      wifeAncestorProfileId: [null],
      fatherAncestorProfileId: [null],
      motherAncestorProfileId: [null],
      siblingAncestorProfileIds: [[]]
    });

    component.updateForm({
      ancestorProfileId: 99,
      firstName: 'Current',
      middleName: '',
      lastName: 'Ancestor',
      suffix: '',
      gender: 'Male',
      birthDate: '1990-03-12T00:00:00',
      birthLocation: '',
      deathDate: '2001-04-30T12:45:00Z',
      deathLocation: '',
      biography: '',
      researchStatus: 'Researching',
      familyBranch: '',
      tags: '',
      confidenceLevel: 'Possible',
      profilePhotoId: null,
      husbandAncestorProfileId: null,
      wifeAncestorProfileId: null,
      fatherAncestorProfileId: null,
      motherAncestorProfileId: null,
      siblingAncestorProfileIds: []
    } as any);

    expect(component.ancestorProfileForm.get('birthDate')?.value).toBe('1990-03-12');
    expect(component.ancestorProfileForm.get('deathDate')?.value).toBe('2001-04-30');
  });

  it('clears spouse and parent selections correctly', () => {
    component.ancestorProfileForm = formBuilder.group({
      gender: ['Male'],
      wifeAncestorProfileId: [7],
      fatherAncestorProfileId: [8],
      motherAncestorProfileId: [9]
    });

    component.clearSpouseSelection();
    component.clearFatherSelection();
    component.clearMotherSelection();

    expect(component.ancestorProfileForm.get('wifeAncestorProfileId')?.value).toBeNull();
    expect(component.ancestorProfileForm.get('fatherAncestorProfileId')?.value).toBeNull();
    expect(component.ancestorProfileForm.get('motherAncestorProfileId')?.value).toBeNull();
  });

  it('removes only the selected sibling ids while preserving the rest', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.ancestorProfileForm.patchValue({ siblingAncestorProfileIds: [10, 20, 30] });
    component.selectedSiblingIds = [10, 20];
    component.clearSelectedSiblings();

    expect(component.ancestorProfileForm.get('siblingAncestorProfileIds')?.value).toEqual([30]);
  });

  it('does not remove sibling relationships when the user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.ancestorProfileForm.patchValue({ siblingAncestorProfileIds: [10, 20, 30] });
    component.selectedSiblingIds = [10, 20];

    component.clearSelectedSiblings();

    expect(component.ancestorProfileForm.get('siblingAncestorProfileIds')?.value).toEqual([10, 20, 30]);
  });

  it('creates a sibling using the selected gender so the new record is treated as a brother or sister', () => {
    const service = {
      create: jasmine.createSpy('create').and.returnValue(makeObservableStub({
        ancestorProfileId: 77,
        firstName: 'Elsi',
        middleName: '',
        lastName: 'Crowe',
        gender: 'Female'
      }))
    } as any;

    const componentWithService = new AncestorProfileEditComponent(
      { snapshot: { paramMap: { get: () => '1' } } } as any,
      formBuilder,
      service,
      {} as any,
      { info: jasmine.createSpy('info'), warning: jasmine.createSpy('warning'), error: jasmine.createSpy('error'), success: jasmine.createSpy('success') } as any,
      { navigate: jasmine.createSpy('navigate'), createUrlTree: jasmine.createSpy('createUrlTree'), serializeUrl: jasmine.createSpy('serializeUrl') } as any,
      { addTags: jasmine.createSpy('addTags') } as any,
      { setTitle: jasmine.createSpy('setTitle') } as any
    );

    componentWithService.newSiblingName = 'Elsi Crowe';
    componentWithService.newSiblingGender = 'Female';
    componentWithService.ancestorProfileForm = formBuilder.group({
      siblingAncestorProfileIds: [[]]
    });

    componentWithService.createAndAddSibling();

    expect(service.create).toHaveBeenCalled();
    const payload = service.create.calls.mostRecent().args[0];
    expect(payload.gender).toBe('Female');
  });

  it('persists the sibling relationship without deleting the person record when a sibling is added', () => {
    let callIndex = 0;
    const service = {
      create: jasmine.createSpy('create').and.callFake(() => {
        callIndex += 1;
        return makeObservableStub(callIndex === 1
          ? {
              ancestorProfileId: 77,
              firstName: 'Oscar',
              middleName: '',
              lastName: 'Crowe',
              gender: 'Male'
            }
          : {
              ancestorProfileId: 1,
              firstName: 'Test',
              middleName: '',
              lastName: 'Ancestor',
              gender: 'Female',
              siblingAncestorProfileIds: [10, 77]
            });
      })
    } as any;

    const componentWithService = new AncestorProfileEditComponent(
      { snapshot: { paramMap: { get: () => '1' } } } as any,
      formBuilder,
      service,
      {} as any,
      { info: jasmine.createSpy('info'), warning: jasmine.createSpy('warning'), error: jasmine.createSpy('error'), success: jasmine.createSpy('success') } as any,
      { navigate: jasmine.createSpy('navigate'), createUrlTree: jasmine.createSpy('createUrlTree'), serializeUrl: jasmine.createSpy('serializeUrl') } as any,
      { addTags: jasmine.createSpy('addTags') } as any,
      { setTitle: jasmine.createSpy('setTitle') } as any
    );

    componentWithService.ancestorProfileForm = formBuilder.group({
      ancestorProfileId: [1],
      firstName: ['Test'],
      middleName: [''],
      lastName: ['Ancestor'],
      suffix: [''],
      gender: ['Female'],
      birthDate: [''],
      birthLocation: [''],
      deathDate: [''],
      deathLocation: [''],
      biography: [''],
      researchStatus: ['Researching'],
      familyBranch: [''],
      tags: [''],
      confidenceLevel: ['Possible'],
      profilePhotoId: [null],
      fatherAncestorProfileId: [null],
      motherAncestorProfileId: [null],
      siblingAncestorProfileIds: [[10]]
    });

    componentWithService.newSiblingName = 'Oscar';
    componentWithService.newSiblingGender = 'Male';

    componentWithService.createAndAddSibling();

    expect(service.create).toHaveBeenCalled();
    const payload = service.create.calls.mostRecent().args[0];
    expect(payload.siblingAncestorProfileIds).toEqual([10, 77]);
    expect(payload.ancestorProfileId).toBe(1);
  });

  it('links a newly created spouse to the current ancestor\'s children', () => {
    const service = {
      addRelationship: jasmine.createSpy('addRelationship').and.returnValue(makeObservableStub(1))
    } as any;

    const componentWithService = new AncestorProfileEditComponent(
      { snapshot: { paramMap: { get: () => '1' } } } as any,
      formBuilder,
      service,
      {} as any,
      { info: jasmine.createSpy('info'), warning: jasmine.createSpy('warning'), error: jasmine.createSpy('error'), success: jasmine.createSpy('success') } as any,
      { navigate: jasmine.createSpy('navigate'), createUrlTree: jasmine.createSpy('createUrlTree'), serializeUrl: jasmine.createSpy('serializeUrl') } as any,
      { addTags: jasmine.createSpy('addTags') } as any,
      { setTitle: jasmine.createSpy('setTitle') } as any
    );

    componentWithService.ancestorProfileForm = formBuilder.group({
      ancestorProfileId: [1],
      firstName: ['Test'],
      middleName: [''],
      lastName: ['Ancestor'],
      suffix: [''],
      gender: ['Male'],
      birthDate: [''],
      birthLocation: [''],
      deathDate: [''],
      deathLocation: [''],
      biography: [''],
      researchStatus: ['Researching'],
      familyBranch: [''],
      tags: [''],
      confidenceLevel: ['Possible'],
      profilePhotoId: [null],
      husbandAncestorProfileId: [null],
      wifeAncestorProfileId: [null],
      fatherAncestorProfileId: [null],
      motherAncestorProfileId: [null],
      siblingAncestorProfileIds: [[]]
    });

    componentWithService.allAncestors = [
      { ancestorProfileId: 1, firstName: 'Test', lastName: 'Ancestor', gender: 'Male', children: [{ ancestorProfileId: 10 }, { ancestorProfileId: 20 }] },
      { ancestorProfileId: 10, firstName: 'Child', lastName: 'One', gender: 'Male' },
      { ancestorProfileId: 20, firstName: 'Child', lastName: 'Two', gender: 'Female' }
    ] as any;

    (componentWithService as any).linkCurrentAncestorChildrenToSpouse(77);

    expect(service.addRelationship).toHaveBeenCalledTimes(2);
    expect(service.addRelationship.calls.allArgs().map((args: any[]) => args[1].relatedAncestorProfileId)).toEqual([10, 20]);
    expect(service.addRelationship.calls.allArgs().every((args: any[]) => args[1].relationshipType === 'Parent')).toBeTrue();
  });

  it('does not mutate the saved sibling ids when sibling ids are staged for removal', () => {
    component.ancestorProfileForm.patchValue({ siblingAncestorProfileIds: [10, 20, 30] });

    component.selectedSiblingIds = [10, 20];

    expect(component.selectedSiblingIds).toEqual([10, 20]);
    expect(component.ancestorProfileForm.get('siblingAncestorProfileIds')?.value).toEqual([10, 20, 30]);
  });

  it('saves the updated sibling list when removing selected siblings so the database reflects the removal immediately', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const service = {
      create: jasmine.createSpy('create').and.returnValue(makeObservableStub({
        ancestorProfileId: 1,
        firstName: 'Test',
        middleName: '',
        lastName: 'Ancestor',
        gender: 'Female',
        siblingAncestorProfileIds: [30]
      })),
      get: jasmine.createSpy('get').and.returnValue(makeObservableStub({
        ancestorProfileId: 1,
        firstName: 'Test',
        middleName: '',
        lastName: 'Ancestor',
        gender: 'Female',
        siblingAncestorProfileIds: [30]
      }))
    } as any;

    const componentWithService = new AncestorProfileEditComponent(
      { snapshot: { paramMap: { get: () => '1' } } } as any,
      formBuilder,
      service,
      {} as any,
      { info: jasmine.createSpy('info'), warning: jasmine.createSpy('warning'), error: jasmine.createSpy('error'), success: jasmine.createSpy('success') } as any,
      { navigate: jasmine.createSpy('navigate'), createUrlTree: jasmine.createSpy('createUrlTree'), serializeUrl: jasmine.createSpy('serializeUrl') } as any,
      { addTags: jasmine.createSpy('addTags') } as any,
      { setTitle: jasmine.createSpy('setTitle') } as any
    );

    componentWithService.ancestorProfileForm = formBuilder.group({
      ancestorProfileId: [1],
      firstName: ['Test'],
      middleName: [''],
      lastName: ['Ancestor'],
      suffix: [''],
      gender: ['Female'],
      birthDate: [''],
      birthLocation: [''],
      deathDate: [''],
      deathLocation: [''],
      biography: [''],
      researchStatus: ['Researching'],
      familyBranch: [''],
      tags: [''],
      confidenceLevel: ['Possible'],
      profilePhotoId: [null],
      fatherAncestorProfileId: [null],
      motherAncestorProfileId: [null],
      siblingAncestorProfileIds: [[10, 20, 30]]
    });

    componentWithService.selectedSiblingIds = [10, 20];

    componentWithService.clearSelectedSiblings();

    expect(service.create).toHaveBeenCalled();
    const payload = service.create.calls.mostRecent().args[0];
    expect(payload.siblingAncestorProfileIds).toEqual([30]);
  });
});
