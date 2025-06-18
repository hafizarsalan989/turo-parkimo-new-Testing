import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FinancialsComponent } from "./components/financials/financials.component";
import { OccupancyComponent } from "./components/occupancy/occupancy.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "financials",
    pathMatch: "full",
  },
  {
    path: "financials",
    component: FinancialsComponent,
  },
  {
    path: "occupancy",
    component: OccupancyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
