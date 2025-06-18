import { NgModule } from "@angular/core";
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  TitleCasePipe,
} from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClipboardModule } from "ngx-clipboard";

import { HostManagementRoutingModule } from "./host-management-routing.module";
import { HostListComponent } from "./components/host-list/host-list.component";
import { ComponentsModule } from "src/app/components/components.module";
import { HostViewComponent } from "./components/host-view/host-view.component";
import { MaterialModule } from "src/app/app.module";
import { ReferralModule } from "src/app/host/referral/referral.module";

@NgModule({
  declarations: [HostListComponent, HostViewComponent],
  imports: [
    CommonModule,
    HostManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule,
    ClipboardModule,
    ReferralModule
  ],
  providers: [TitleCasePipe, DatePipe, CurrencyPipe],
})
export class HostManagementModule {}
