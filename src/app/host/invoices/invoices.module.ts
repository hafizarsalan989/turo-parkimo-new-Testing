import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InvoicesRoutingModule } from "./invoices-routing.module";
import { InvoiceListComponent } from "./components/invoice-list/invoice-list.component";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  declarations: [InvoiceListComponent],
  imports: [CommonModule, InvoicesRoutingModule, ComponentsModule],
})
export class InvoicesModule {}
