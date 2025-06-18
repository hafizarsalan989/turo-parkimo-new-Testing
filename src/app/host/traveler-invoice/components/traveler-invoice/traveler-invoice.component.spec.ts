import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelerInvoiceComponent } from './traveler-invoice.component';

describe('BillbackEditorComponent', () => {
  let component: TravelerInvoiceComponent;
  let fixture: ComponentFixture<TravelerInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelerInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelerInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
