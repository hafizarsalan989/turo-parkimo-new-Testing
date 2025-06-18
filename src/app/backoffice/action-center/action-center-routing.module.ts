import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RoleGuard } from "src/app/core/guards/role.guard";
import { ActionCenterListComponent } from "./components/action-center-list/action-center-list.component";
import { ActionCenterComponent } from "./components/action-center/action-center.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    component: ActionCenterListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Action Center List" },
  },
  {
    path: ":id/view",
    component: ActionCenterComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Action Center View" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionCenterRoutingModule {}
