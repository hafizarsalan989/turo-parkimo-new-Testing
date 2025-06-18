import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelerInvoiceListComponent } from './traveler-invoice-list.component';

describe('TravelerInvoiceListComponent', () => {
  let component: TravelerInvoiceListComponent;
  let fixture: ComponentFixture<TravelerInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelerInvoiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelerInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
