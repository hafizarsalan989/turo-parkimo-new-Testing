import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DeliveryFeeComponent } from "./components/delivery-fee/delivery-fee.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RoleGuard } from "src/app/core/guards/role.guard";
import { CalculatorComponent } from "./components/calculator/calculator.component";

const routes: Routes = [
  {
    path: "",
    component: CalculatorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Calculator" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryFeeRoutingModule {}
