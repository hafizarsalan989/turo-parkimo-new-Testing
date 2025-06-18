import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DocumentComponent } from "./components/document/document.component";
import { ActivityComponent } from "./components/activity/activity.component";
import { DeviceMonitoringComponent } from "./components/device-monitoring/device-monitoring.component";
import { CredentialsComponent } from "./components/credentials/credentials.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "document",
  },
  {
    path: "document",
    component: DocumentComponent,
  },
  {
    path: "activity",
    component: ActivityComponent,
  },
  {
    path: "device-monitoring",
    component: DeviceMonitoringComponent,
  },
  {
    path: "credentials",
    component: CredentialsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}
