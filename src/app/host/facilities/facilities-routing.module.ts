import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FacilityListComponent } from "./components/facility-list/facility-list.component";
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
    component: FacilityListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Facilities' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilitiesRoutingModule {}
