import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ChaseCarListComponent } from "./components/chase-car-list/chase-car-list.component";
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
    component: ChaseCarListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Chase cars" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChaseCarsRoutingModule {}
