import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityFinancialsComponent } from './facility-financials.component';

describe('FacilityFinancialsComponent', () => {
  let component: FacilityFinancialsComponent;
  let fixture: ComponentFixture<FacilityFinancialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityFinancialsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
