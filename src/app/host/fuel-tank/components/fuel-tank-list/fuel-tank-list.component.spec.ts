import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTankListComponent } from './fuel-tank-list.component';

describe('FuelTankListComponent', () => {
  let component: FuelTankListComponent;
  let fixture: ComponentFixture<FuelTankListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelTankListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelTankListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
