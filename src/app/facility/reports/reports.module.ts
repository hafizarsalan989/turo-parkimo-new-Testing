import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ReportsRoutingModule } from "./reports-routing.module";
import { FinancialsComponent } from "./components/financials/financials.component";
import { ComponentsModule } from "src/app/components/components.module";
import { OccupancyComponent } from "./components/occupancy/occupancy.component";
import { MaterialModule } from "src/app/app.module";

@NgModule({
  declarations: [FinancialsComponent, OccupancyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    ComponentsModule,
    MaterialModule,
  ],
})
export class ReportsModule {}
