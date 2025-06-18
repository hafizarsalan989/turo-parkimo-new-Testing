import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ContractParkingRoutingModule } from "./contract-parking-routing.module";
import { PoolManagementComponent } from "./components/pool-management/pool-management.component";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  declarations: [PoolManagementComponent],
  imports: [
    CommonModule,
    ContractParkingRoutingModule,
    ComponentsModule
  ],
})
export class ContractParkingModule {}
