import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TravelerInvoiceComponent } from "./components/traveler-invoice/traveler-invoice.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RoleGuard } from "src/app/core/guards/role.guard";

const routes: Routes = [
  {
    path: "",
    component: TravelerInvoiceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Guest Pay" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelerInvoiceRoutingModule {}
