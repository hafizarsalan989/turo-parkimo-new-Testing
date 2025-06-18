import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSummaryModalComponent } from './invoice-summary-modal.component';

describe('InvoiceSummaryModalComponent', () => {
  let component: InvoiceSummaryModalComponent;
  let fixture: ComponentFixture<InvoiceSummaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceSummaryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceSummaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
