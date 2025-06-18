import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LocationsComponent } from "../components/locations/locations.component";
import { DeliveryFeeComponent } from "./delivery-fee/components/delivery-fee/delivery-fee.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "vehicle",
  },
  {
    path: "vehicle",
    loadChildren: () =>
      import("./vehicles/vehicles.module").then((m) => m.VehiclesModule),
  },
  {
    path: "invoice",
    loadChildren: () =>
      import("./invoices/invoices.module").then((m) => m.InvoicesModule),
  },
  {
    path: "product",
    loadChildren: () =>
      import("./product/product.module").then((m) => m.ProductModule),
  },
  {
    path: "chase-car",
    loadChildren: () =>
      import("./chase-cars/chase-cars.module").then((m) => m.ChaseCarsModule),
  },
   {
    path: "delivery-fee",
    loadChildren: () =>
      import("./delivery-fee/delivery-fee.module").then((m) => m.DeliveryFeeModule),
  },
  {
    path: "reserved-space",
    loadChildren: () =>
      import("./reserved-spaces/reserved-spaces.module").then(
        (m) => m.ReservedSpacesModule
      ),
  },
  {
    path: "tag-ordering",
    loadChildren: () =>
      import("./tag-ordering/tag-ordering.module").then(
        (m) => m.TagOrderingModule
      ),
  },
  {
    path: "guest-pay",
    loadChildren: () =>
      import("./traveler-invoice/traveler-invoices.module").then(
        (m) => m.TravelerInvoicesModule
      ),
  },
  {
    path: "fuel-tank",
    loadChildren: () =>
      import("./fuel-tank/fuel-tank.module").then((m) => m.FuelTankModule),
  },
  {
    path: "referral",
    loadChildren: () =>
      import("./referral/referral.module").then((m) => m.ReferralModule),
  },
  {
    path: "qr-management",
    loadChildren: () =>
      import("./qr-management/qr-management.module").then(
        (m) => m.QrManagementModule
      ),
  },
  {
    path: "user",
    loadChildren: () =>
      import("./../users/users.module").then((m) => m.UsersModule),
  },
  {
    path: "locations",
    component: LocationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostRoutingModule {}
