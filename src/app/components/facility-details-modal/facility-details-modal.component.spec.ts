import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityDetailsModalComponent } from './facility-details-modal.component';

describe('FacilityDetailsModalComponent', () => {
  let component: FacilityDetailsModalComponent;
  let fixture: ComponentFixture<FacilityDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityDetailsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
