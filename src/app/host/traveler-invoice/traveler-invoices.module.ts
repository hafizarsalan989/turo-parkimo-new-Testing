import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

import { TravelerInvoicesRoutingModule } from './traveler-invoices-routing.module';
import { TravelerInvoiceListComponent } from './components/traveler-invoice-list/traveler-invoice-list.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { TravelerInvoiceComponent } from './components/traveler-invoice/traveler-invoice.component';
import { MaterialModule } from 'src/app/app.module';


@NgModule({
  declarations: [
    TravelerInvoiceListComponent,
    TravelerInvoiceComponent
  ],
  imports: [
    CommonModule,
    TravelerInvoicesRoutingModule,
    ComponentsModule,
    MaterialModule,
    ReactiveFormsModule,
    ClipboardModule
  ]
})
export class TravelerInvoicesModule { }
