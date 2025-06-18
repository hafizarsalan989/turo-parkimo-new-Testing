import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCloseModalComponent } from './session-close-modal.component';

describe('SessionCloseModalComponent', () => {
  let component: SessionCloseModalComponent;
  let fixture: ComponentFixture<SessionCloseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionCloseModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionCloseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
