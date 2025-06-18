import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReservedSpaceListComponent } from "./components/reserved-space-list/reserved-space-list.component";
import { RoleGuard } from "src/app/core/guards/role.guard";
import { AuthGuard } from "src/app/core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    component: ReservedSpaceListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Reserved Spaces" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservedSpacesRoutingModule {}
