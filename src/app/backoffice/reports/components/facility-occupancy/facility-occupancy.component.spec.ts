import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityOccupancyComponent } from './facility-occupancy.component';

describe('FacilityOccupancyComponent', () => {
  let component: FacilityOccupancyComponent;
  let fixture: ComponentFixture<FacilityOccupancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityOccupancyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityOccupancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
