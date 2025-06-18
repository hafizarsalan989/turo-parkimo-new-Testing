import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { TravelerInvoiceRoutingModule } from "./traveler-invoice-routing.module";
import { TravelerInvoiceComponent } from "./components/traveler-invoice/traveler-invoice.component";
import { ComponentsModule } from "src/app/components/components.module";
import { MaterialModule } from "src/app/app.module";

@NgModule({
  declarations: [TravelerInvoiceComponent],
  imports: [
    CommonModule,
    TravelerInvoiceRoutingModule,
    ComponentsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class TravelerInvoiceModule {}
