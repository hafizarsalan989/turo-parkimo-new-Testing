import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/app.module';
import { DeliveryFeeRoutingModule } from './delivery-fee-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { DeliveryFeeComponent } from './components/delivery-fee/delivery-fee.component';
import { CalculatorComponent } from './components/calculator/calculator.component';


@NgModule({
  declarations: [
    DeliveryFeeComponent,
    CalculatorComponent
  ],
  imports: [
    CommonModule,
    DeliveryFeeRoutingModule,
    FormsModule,
    MaterialModule,
    ComponentsModule
  ]
})
export class DeliveryFeeModule { }
