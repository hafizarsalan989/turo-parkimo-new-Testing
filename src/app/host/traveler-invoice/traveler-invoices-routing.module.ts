import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TravelerInvoiceListComponent } from "./components/traveler-invoice-list/traveler-invoice-list.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RoleGuard } from "src/app/core/guards/role.guard";
import { TravelerInvoiceComponent } from "./components/traveler-invoice/traveler-invoice.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    component: TravelerInvoiceListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Guest Pay" },
  },
  {
    path: "add",
    component: TravelerInvoiceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "New Guest Pay" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelerInvoicesRoutingModule {}
