import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AncestorProfile } from 'src/app/models/genealogy/ancestor-profile.model';
import { SiblingEditSectionComponent } from './sibling-edit-section.component';

describe('SiblingEditSectionComponent', () => {
  let component: SiblingEditSectionComponent;
  let fixture: ComponentFixture<SiblingEditSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiblingEditSectionComponent],
      imports: [FormsModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SiblingEditSectionComponent);
    component = fixture.componentInstance;
  });

  it('displays sibling details, links, and a remove button for each row', () => {
    component.currentSiblingAncestors = [
      new AncestorProfile(10, 'Mary', 'Ann', 'Crowe', undefined, 'Female', '1901-02-03', undefined, '1980-04-05'),
      new AncestorProfile(20, 'John', undefined, 'Crowe', undefined, 'Male')
    ];
    spyOn(component.removeSibling, 'emit');
    fixture.detectChanges();

    const rows: HTMLTableRowElement[] = Array.from(fixture.nativeElement.querySelectorAll('tbody tr'));
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Mary');
    expect(rows[0].textContent).toContain('Ann');
    expect(rows[0].textContent).toContain('Crowe');
    expect(rows[0].textContent).toContain('Sister');
    expect(rows[0].textContent).toContain('Feb 3, 1901');
    expect(rows[0].textContent).toContain('Apr 5, 1980');
    expect(rows[1].textContent).toContain('Brother');
    const links = rows[0].querySelectorAll('a');
    expect(links[0].getAttribute('href')).toBe('/genealogy/ancestors/10');
    expect(links[1].getAttribute('href')).toBe('/genealogy/ancestors/10');
    expect(links[2].getAttribute('href')).toBe('/genealogy/ancestors/10');
    expect(links[3].getAttribute('href')).toBe('/genealogy/ancestors/edit/10');
    rows[0].querySelector('button')!.click();
    expect(component.removeSibling.emit).toHaveBeenCalledOnceWith(10);
  });

  it('shows an empty state and disables removal while a request is pending', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No siblings are linked.');

    component.currentSiblingAncestors = [new AncestorProfile(10, 'Mary')];
    component.isRemovingSibling = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tbody button').disabled).toBeTrue();
  });
});
