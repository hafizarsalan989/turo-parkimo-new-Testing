import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { FacilitiesRoutingModule } from "./facilities-routing.module";
import { FacilityListComponent } from "./components/facility-list/facility-list.component";
import { MaterialModule } from "src/app/app.module";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  declarations: [FacilityListComponent],
  imports: [
    CommonModule,
    FacilitiesRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
})
export class FacilitiesModule {}
