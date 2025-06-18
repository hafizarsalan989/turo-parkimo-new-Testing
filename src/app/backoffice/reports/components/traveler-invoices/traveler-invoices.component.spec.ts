import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelerInvoicesComponent } from './traveler-invoices.component';

describe('TravelerInvoicesComponent', () => {
  let component: TravelerInvoicesComponent;
  let fixture: ComponentFixture<TravelerInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelerInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelerInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
