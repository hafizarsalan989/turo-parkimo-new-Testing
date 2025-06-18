import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleListTableComponent } from './vehicle-list-table.component';

describe('VehicleListTableComponent', () => {
  let component: VehicleListTableComponent;
  let fixture: ComponentFixture<VehicleListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
