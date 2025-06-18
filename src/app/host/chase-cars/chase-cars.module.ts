import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/app.module';
import { ChaseCarsRoutingModule } from './chase-cars-routing.module';
import { ChaseCarListComponent } from './components/chase-car-list/chase-car-list.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    ChaseCarListComponent
  ],
  imports: [
    CommonModule,
    ChaseCarsRoutingModule,
    FormsModule,
    MaterialModule,
    ComponentsModule
  ]
})
export class ChaseCarsModule { }
