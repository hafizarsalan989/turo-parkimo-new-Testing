import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostNoteListTableComponent } from './host-note-list-table.component';

describe('HostNoteListTableComponent', () => {
  let component: HostNoteListTableComponent;
  let fixture: ComponentFixture<HostNoteListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostNoteListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostNoteListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
