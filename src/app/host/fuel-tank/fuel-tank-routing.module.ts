import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FuelTankListComponent } from "./components/fuel-tank-list/fuel-tank-list.component";
import { FuelTankWithdrawComponent } from "./components/fuel-tank-withdraw/fuel-tank-withdraw.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RoleGuard } from "src/app/core/guards/role.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    component: FuelTankListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Fuel Tank" },
  },
  {
    path: "withdraw",
    component: FuelTankWithdrawComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Fuel Tank Withdraw" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuelTankRoutingModule {}
