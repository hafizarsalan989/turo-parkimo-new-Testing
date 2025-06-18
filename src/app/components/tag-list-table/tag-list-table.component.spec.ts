import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagListTableComponent } from './tag-list-table.component';

describe('TagListTableComponent', () => {
  let component: TagListTableComponent;
  let fixture: ComponentFixture<TagListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
