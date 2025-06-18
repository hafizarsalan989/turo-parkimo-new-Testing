import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RoleGuard } from "src/app/core/guards/role.guard";
import { VehicleDetailComponent } from "./components/vehicle-detail/vehicle-detail.component";
import { VehicleListComponent } from "./components/vehicle-list/vehicle-list.component";
import { VehicleRegisterComponent } from "./components/vehicle-register/vehicle-register.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { VehicleActivatorComponent } from "./components/vehicle-activator/vehicle-activator.component";
import { VehicleActivityComponent } from "./components/vehicle-activity/vehicle-activity.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    component: VehicleListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Vehicles' }
  },
  {
    path: "add",
    component: VehicleRegisterComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Add Vehicle' }
  },
  {
    path: ":id/view",
    component: VehicleDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'View Vehicle', editable: false },
  },
  {
    path: ":id/edit",
    component: VehicleDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Edit Vehicle', editable: true },
  },
  {
    path: ":id/activate",
    component: VehicleActivatorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Activate Vehicle' },
  },
  {
    path: ":id/activity",
    component: VehicleActivityComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Vehicle Activity' },
  },
  {
    path: "activate/bulk",
    component: VehicleActivatorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Activate Vehicle' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclesRoutingModule {}
