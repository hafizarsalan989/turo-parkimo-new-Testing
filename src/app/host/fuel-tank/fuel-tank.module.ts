import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { FuelTankRoutingModule } from "./fuel-tank-routing.module";
import { FuelTankListComponent } from "./components/fuel-tank-list/fuel-tank-list.component";
import { ComponentsModule } from "src/app/components/components.module";
import { MaterialModule } from "src/app/app.module";
import { FuelTankWithdrawComponent } from "./components/fuel-tank-withdraw/fuel-tank-withdraw.component";

@NgModule({
  declarations: [FuelTankListComponent, FuelTankWithdrawComponent],
  imports: [
    CommonModule,
    FuelTankRoutingModule,
    ComponentsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class FuelTankModule {}
