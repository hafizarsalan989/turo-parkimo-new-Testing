import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TagShippingComponent } from "./components/tag-shipping/tag-shipping.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RoleGuard } from "src/app/core/guards/role.guard";

const routes: Routes = [
  {
    path: "",
    component: TagShippingComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Tag Shipping" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagShippingRoutingModule {}
