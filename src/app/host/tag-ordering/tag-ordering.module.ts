import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TagOrderingRoutingModule } from './tag-ordering-routing.module';
import { TagOrderingComponent } from './components/tag-ordering/tag-ordering.component';
import { MaterialModule } from 'src/app/app.module';


@NgModule({
  declarations: [
    TagOrderingComponent
  ],
  imports: [
    CommonModule,
    TagOrderingRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class TagOrderingModule { }
