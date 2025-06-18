import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionListTableComponent } from './session-list-table.component';

describe('SessionListTableComponent', () => {
  let component: SessionListTableComponent;
  let fixture: ComponentFixture<SessionListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
