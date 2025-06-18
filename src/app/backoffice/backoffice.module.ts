import { NgModule } from "@angular/core";
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  TitleCasePipe,
} from "@angular/common";

import { BackofficeRoutingModule } from "./backoffice-routing.module";
import { MaterialModule } from "../app.module";
import { ComponentsModule } from "../components/components.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReceiptsComponent } from "./receipts/receipts.component";
import { CallCenterComponent } from './call-center/call-center.component';

@NgModule({
  declarations: [ReceiptsComponent, CallCenterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BackofficeRoutingModule,
    MaterialModule,
    ComponentsModule,
  ],
  providers: [TitleCasePipe, DatePipe, CurrencyPipe],
})
export class BackofficeModule {}
