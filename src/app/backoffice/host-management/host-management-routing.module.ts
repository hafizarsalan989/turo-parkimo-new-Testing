import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HostListComponent } from "./components/host-list/host-list.component";
import { RoleGuard } from "src/app/core/guards/role.guard";
import { HostViewComponent } from "./components/host-view/host-view.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    component: HostListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Host Management" },
  },
  {
    path: ":id/view",
    component: HostViewComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "View Host" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostManagementRoutingModule {}
