import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleActivityComponent } from './vehicle-activity.component';

describe('VehicleActivityComponent', () => {
  let component: VehicleActivityComponent;
  let fixture: ComponentFixture<VehicleActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
