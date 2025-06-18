import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractParkingPoolManagementComponent } from './contract-parking-pool-management.component';

describe('ContractParkingPoolManagementComponent', () => {
  let component: ContractParkingPoolManagementComponent;
  let fixture: ComponentFixture<ContractParkingPoolManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractParkingPoolManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractParkingPoolManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
