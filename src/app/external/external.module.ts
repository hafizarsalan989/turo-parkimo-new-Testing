import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { ExternalRoutingModule } from "./external-routing.module";
import { InvoiceComponent } from "./components/invoice/invoice.component";
import { PrintTagMailerComponent } from "./components/print-tag-mailer/print-tag-mailer.component";
import {
  CustomDateFormatMMDDYYYY,
  CustomDateFormatMMYY,
  PayComponent,
} from "./components/pay/pay.component";
import { MaterialModule } from "../app.module";

@NgModule({
  declarations: [
    InvoiceComponent,
    PrintTagMailerComponent,
    PayComponent,
    CustomDateFormatMMYY,
    CustomDateFormatMMDDYYYY,
  ],
  imports: [
    CommonModule,
    ExternalRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CKEditorModule,
  ],
})
export class ExternalModule {}
