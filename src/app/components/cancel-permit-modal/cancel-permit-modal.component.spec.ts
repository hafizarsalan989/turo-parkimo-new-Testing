import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelPermitModalComponent } from './cancel-permit-modal.component';

describe('CancelPermitModalComponent', () => {
  let component: CancelPermitModalComponent;
  let fixture: ComponentFixture<CancelPermitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelPermitModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelPermitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
