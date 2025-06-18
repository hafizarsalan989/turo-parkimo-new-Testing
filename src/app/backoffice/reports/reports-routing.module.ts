import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FacilityFinancialsComponent } from "./components/facility-financials/facility-financials.component";
import { FacilityOccupancyComponent } from "./components/facility-occupancy/facility-occupancy.component";
import { DeniedTagsComponent } from "./components/denied-tags/denied-tags.component";
import { CityPassCountComponent } from "./components/city-pass-count/city-pass-count.component";
import { TravelerInvoicesComponent } from "./components/traveler-invoices/traveler-invoices.component";
import { SystemComponent } from "./components/system/system.component";
import { GuestPayComponent } from "./components/guest-pay/guest-pay.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "facility-financials",
    pathMatch: "full",
  },
  {
    path: "facility-financials",
    component: FacilityFinancialsComponent,
  },
  {
    path: "facility-occupancy",
    component: FacilityOccupancyComponent,
  },
  {
    path: "denied-tags",
    component: DeniedTagsComponent,
  },
  {
    path: "city-pass-count",
    component: CityPassCountComponent,
  },
  {
    path: "traveler-invoices",
    component: TravelerInvoicesComponent,
  },
  {
    path: "system",
    component: SystemComponent,
  },
  {
    path: "guest-pay",
    component: GuestPayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
