import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedSpaceListTableComponent } from './reserved-space-list-table.component';

describe('ReservedSpaceListTableComponent', () => {
  let component: ReservedSpaceListTableComponent;
  let fixture: ComponentFixture<ReservedSpaceListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservedSpaceListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservedSpaceListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
