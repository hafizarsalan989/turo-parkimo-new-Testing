import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTankComponent } from './fuel-tank.component';

describe('FuelTankComponent', () => {
  let component: FuelTankComponent;
  let fixture: ComponentFixture<FuelTankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelTankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
