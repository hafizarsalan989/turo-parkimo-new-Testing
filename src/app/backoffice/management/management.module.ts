import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";

import { ManagementRoutingModule } from "./management-routing.module";
import { DocumentComponent } from "./components/document/document.component";
import { ComponentsModule } from "src/app/components/components.module";
import { MaterialModule } from "src/app/app.module";
import { ActivityComponent } from "./components/activity/activity.component";
import { DeviceMonitoringComponent } from "./components/device-monitoring/device-monitoring.component";
import { CredentialsComponent } from "./components/credentials/credentials.component";

@NgModule({
  declarations: [
    DocumentComponent,
    ActivityComponent,
    DeviceMonitoringComponent,
    CredentialsComponent,
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    ComponentsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
  ],
})
export class ManagementModule {}
