import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { VehicleSearchComponent } from "./vehicle-search/components/vehicle-search/vehicle-search.component";
import { AuthGuard } from "../core/guards/auth.guard";
import { RoleGuard } from "../core/guards/role.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "vehicle-search",
    pathMatch: "full",
  },
  {
    path: "vehicle-search",
    component: VehicleSearchComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Vehicle Search" },
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./reports/reports.module").then((m) => m.ReportsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityRoutingModule {}
