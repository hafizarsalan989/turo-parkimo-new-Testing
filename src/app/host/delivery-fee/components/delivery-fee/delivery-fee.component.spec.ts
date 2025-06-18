import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryFeeComponent } from './delivery-fee.component';

describe('DeliveryFeeComponent', () => {
  let component: DeliveryFeeComponent;
  let fixture: ComponentFixture<DeliveryFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryFeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
