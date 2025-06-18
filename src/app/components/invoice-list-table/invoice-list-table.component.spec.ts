import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceListTableComponent } from './invoice-list-table.component';

describe('InvoiceListTableComponent', () => {
  let component: InvoiceListTableComponent;
  let fixture: ComponentFixture<InvoiceListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
