import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTankWithdrawComponent } from './fuel-tank-withdraw.component';

describe('FuelTankWithdrawComponent', () => {
  let component: FuelTankWithdrawComponent;
  let fixture: ComponentFixture<FuelTankWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelTankWithdrawComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelTankWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
