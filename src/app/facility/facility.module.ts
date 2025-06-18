import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MaterialModule } from '../app.module';
import { ComponentsModule } from '../components/components.module';
import { FacilityRoutingModule } from './facility-routing.module';
import { VehicleSearchComponent } from './vehicle-search/components/vehicle-search/vehicle-search.component';


@NgModule({
  declarations: [
    VehicleSearchComponent
  ],
  imports: [
    CommonModule,
    FacilityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule
  ]
})
export class FacilityModule { }
