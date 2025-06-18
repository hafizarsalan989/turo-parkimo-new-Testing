import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCenterListComponent } from './action-center-list.component';

describe('ActionCenterListComponent', () => {
  let component: ActionCenterListComponent;
  let fixture: ComponentFixture<ActionCenterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionCenterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionCenterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
