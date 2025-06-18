import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleActivatorComponent } from './vehicle-activator.component';

describe('PermitEditorComponent', () => {
  let component: VehicleActivatorComponent;
  let fixture: ComponentFixture<VehicleActivatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleActivatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleActivatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
