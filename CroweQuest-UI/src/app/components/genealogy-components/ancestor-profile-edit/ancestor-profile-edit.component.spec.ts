import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AncestorProfileEditComponent } from './ancestor-profile-edit.component';
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

  it('does not mutate the saved sibling ids when the user selects siblings for removal', () => {
    component.ancestorProfileForm.patchValue({ siblingAncestorProfileIds: [10, 20, 30] });

    const select = document.createElement('select');
    select.multiple = true;

    const option1 = document.createElement('option');
    option1.value = '10';
    option1.selected = true;

    const option2 = document.createElement('option');
    option2.value = '20';
    option2.selected = true;

    select.appendChild(option1);
    select.appendChild(option2);

    component.onSiblingSelectionChange({ target: select } as unknown as Event);

    expect(component.selectedSiblingIds).toEqual([10, 20]);
    expect(component.ancestorProfileForm.get('siblingAncestorProfileIds')?.value).toEqual([10, 20, 30]);
  });

  it('clears the visual sibling selection when focus leaves the list', () => {
    const select = document.createElement('select');
    select.multiple = true;

    const option1 = document.createElement('option');
    option1.value = '10';
    option1.selected = true;

    const option2 = document.createElement('option');
    option2.value = '20';
    option2.selected = true;

    select.appendChild(option1);
    select.appendChild(option2);

    component.selectedSiblingIds = [10, 20];
    component.onSiblingSelectionBlur({ target: select, relatedTarget: null } as unknown as FocusEvent);

    expect(component.selectedSiblingIds).toEqual([]);
    expect(Array.from(select.options).every((option) => !option.selected)).toBeTrue();
  });

  it('keeps the selected sibling ids when focus moves to the remove button', () => {
    const button = document.createElement('button');
    button.className = 'remove-sibling-button';
    document.body.appendChild(button);

    component.selectedSiblingIds = [10, 20];
    component.beginSiblingRemovalClick();

    component.onSiblingSelectionBlur({ target: document.createElement('select'), relatedTarget: button } as unknown as FocusEvent);

    expect(component.selectedSiblingIds).toEqual([10, 20]);

    button.remove();
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
