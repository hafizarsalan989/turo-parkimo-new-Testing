import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionLogFileComponent } from './action-log-file.component';

describe('ActionLogFileComponent', () => {
  let component: ActionLogFileComponent;
  let fixture: ComponentFixture<ActionLogFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionLogFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionLogFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
