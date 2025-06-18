import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { QrManagementRoutingModule } from "./qr-management-routing.module";
import { QrManagementComponent } from "./components/qr-management/qr-management.component";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  declarations: [QrManagementComponent],
  imports: [
    CommonModule,
    QrManagementRoutingModule,
    ComponentsModule
  ],
})
export class QrManagementModule {}
