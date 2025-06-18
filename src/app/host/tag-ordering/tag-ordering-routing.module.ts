import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TagOrderingComponent } from "./components/tag-ordering/tag-ordering.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RoleGuard } from "src/app/core/guards/role.guard";

const routes: Routes = [
  {
    path: "",
    component: TagOrderingComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Tag Ordering" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagOrderingRoutingModule {}
