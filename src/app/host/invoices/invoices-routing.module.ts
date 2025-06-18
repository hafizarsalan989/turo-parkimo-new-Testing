import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RoleGuard } from "src/app/core/guards/role.guard";
import { InvoiceListComponent } from "./components/invoice-list/invoice-list.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    component: InvoiceListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Host Invoices' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesRoutingModule {}
