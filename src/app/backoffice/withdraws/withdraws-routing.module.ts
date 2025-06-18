import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WithdrawsComponent } from "./components/withdraws/withdraws.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RoleGuard } from "src/app/core/guards/role.guard";

const routes: Routes = [
  {
    path: "",
    component: WithdrawsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Withdraws" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawsRoutingModule {}
