import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TagMasterExportsListComponent } from "./components/tag-master-exports-list/tag-master-exports-list.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RoleGuard } from "src/app/core/guards/role.guard";

const routes: Routes = [
  {
    path: "",
    component: TagMasterExportsListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Tag Master Exports" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagMasterExportsRoutingModule {}
