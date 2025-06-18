import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { InvoiceComponent } from "./components/invoice/invoice.component";
import { PrintTagMailerComponent } from "./components/print-tag-mailer/print-tag-mailer.component";
import { AuthGuard } from "../core/guards/auth.guard";
import { RoleGuard } from "../core/guards/role.guard";
import { LegacyPayGuard } from "../core/guards/legacy-pay.guard";
import { PayComponent } from "./components/pay/pay.component";

const routes: Routes = [
  {
    path: "invoice/:id",
    component: InvoiceComponent,
    data: { title: "View Invoice" },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "print-tag-mailer",
    component: PrintTagMailerComponent,
    data: { title: "Print Tag" },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "pay/:id",
    component: PayComponent,
    data: { title: "Pay Invoice" },
    canActivate: [LegacyPayGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalRoutingModule {}
