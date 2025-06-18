import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "contract-parking",
  },
  {
    path: "contract-parking",
    loadChildren: () =>
      import("./contract-parking/contract-parking.module").then(
        (m) => m.ContractParkingModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolRoutingModule {}
