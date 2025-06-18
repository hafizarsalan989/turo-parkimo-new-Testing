import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PoolManagementComponent } from "./components/pool-management/pool-management.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "pool-management",
    pathMatch: "full",
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
