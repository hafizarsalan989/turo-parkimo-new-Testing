import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PoolManagementComponent } from "./components/pool-management/pool-management.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "pool-management",
  },
  {
    path: "pool-management",
    component: PoolManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractParkingRoutingModule {}
