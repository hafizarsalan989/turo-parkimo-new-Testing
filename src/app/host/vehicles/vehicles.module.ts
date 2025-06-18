import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/app.module";
import { ComponentsModule } from "src/app/components/components.module";

import { VehiclesRoutingModule } from "./vehicles-routing.module";
import { VehicleDetailComponent } from "./components/vehicle-detail/vehicle-detail.component";
import { VehicleListComponent } from "./components/vehicle-list/vehicle-list.component";
import { VehicleRegisterComponent } from "./components/vehicle-register/vehicle-register.component";
import { VehicleActivatorComponent } from "./components/vehicle-activator/vehicle-activator.component";
import { VehicleActivityComponent } from "./components/vehicle-activity/vehicle-activity.component";

@NgModule({
  declarations: [
    VehicleListComponent,
    VehicleRegisterComponent,
    VehicleDetailComponent,
    VehicleActivatorComponent,
    VehicleActivityComponent
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule,
  ],
})
export class VehiclesModule {}
