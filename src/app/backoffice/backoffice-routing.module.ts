import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReceiptsComponent } from "./receipts/receipts.component";
import { AuthGuard } from "../core/guards/auth.guard";
import { RoleGuard } from "../core/guards/role.guard";
import { CallCenterComponent } from "./call-center/call-center.component";
import { LocationsComponent } from "../components/locations/locations.component";
import { ReferralModule } from "../host/referral/referral.module";
const routes: Routes = [
  {
    path: "",
    redirectTo: "work-queue",
    pathMatch: "full",
  },
  {
    path: "work-queue",
    loadChildren: () =>
      import("./work-queue/work-queue.module").then((m) => m.WorkQueueModule),
  },
  {
    path: "action-center",
    loadChildren: () =>
      import("./action-center/action-center.module").then(
        (m) => m.ActionCenterModule
      ),
  },
  {
    path: "host-management",
    loadChildren: () =>
      import("./host-management/host-management.module").then(
        (m) => m.HostManagementModule
      ),
  },
  {
    path: "receipt",
    component: ReceiptsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Receipts" },
  },
  {
    path: "tag-shipping",
    loadChildren: () =>
      import("./tag-shipping/tag-shipping.module").then(
        (m) => m.TagShippingModule
      ),
  },
  {
    path: "tag-master-exports",
    loadChildren: () =>
      import("./tag-master-exports/tag-master-exports.module").then(
        (m) => m.TagMasterExportsModule
      ),
  },
  {
    path: "guest-pay",
    loadChildren: () =>
      import("./traveler-invoice/traveler-invoice.module").then(
        (m) => m.TravelerInvoiceModule
      ),
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./reports/reports.module").then((m) => m.ReportsModule),
  },
  {
    path: "referral",
    loadChildren: () =>
      import("../host/referral/referral.module").then((m) => m.ReferralModule),

  },
  {
    path: "message-center",
    loadChildren: () =>
      import("./message-center/message-center.module").then(
        (m) => m.MessageCenterModule
      ),
  },
  {
    path: "withdraws",
    loadChildren: () =>
      import("./withdraws/withdraws.module").then((m) => m.WithdrawsModule),
  },
  {
    path: "contract-parking",
    loadChildren: () =>
      import("./contract-parking/contract-parking.module").then(
        (m) => m.ContractParkingModule
      ),
  },
  {
    path: "call-center",
    component: CallCenterComponent,
  },
  {
    path: "locations",
    component: LocationsComponent,
  },
  {
    path: "management",
    loadChildren: () =>
      import("./management/management.module").then((m) => m.ManagementModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficeRoutingModule { }
