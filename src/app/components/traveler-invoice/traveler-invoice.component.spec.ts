import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelInvoiceComponent } from './traveler-invoice.component';

describe('TravelInvoiceComponent', () => {
  let component: TravelInvoiceComponent;
  let fixture: ComponentFixture<TravelInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
