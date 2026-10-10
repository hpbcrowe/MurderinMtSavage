import { BehaviorSubject, of } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { AncestorProfileComponent } from './ancestor-profile.component';

describe('AncestorProfileComponent', () => {
  it('reloads the ancestor data when the route id changes to a different profile', () => {
    const routeParams$ = new BehaviorSubject(convertToParamMap({ id: '5' }));
    const route = {
      paramMap: routeParams$,
      snapshot: {
        paramMap: { get: () => '5' }
      }
    } as any;

    const service = {
      get: jasmine.createSpy('get').and.callFake((id: number) => of({
        ancestorProfileId: id,
        firstName: 'Test',
        middleName: '',
        lastName: 'Ancestor',
        profilePhotoId: null
      }))
    } as any;

    const router = { navigate: jasmine.createSpy('navigate') } as any;
    const photoService = {
      get: jasmine.createSpy('get').and.returnValue(of(null))
    } as any;

    const component = new AncestorProfileComponent(
      route,
      router,
      service,
      photoService,
      { addTags: jasmine.createSpy('addTags') } as any,
      { setTitle: jasmine.createSpy('setTitle') } as any
    );

    component.ngOnInit();
    routeParams$.next(convertToParamMap({ id: '12' }));

    expect(service.get.calls.count()).toBe(2);
    expect(service.get.calls.mostRecent().args[0]).toBe(12);
  });
});
