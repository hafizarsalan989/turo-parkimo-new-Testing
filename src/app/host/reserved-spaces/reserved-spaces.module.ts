import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservedSpacesRoutingModule } from './reserved-spaces-routing.module';
import { ReservedSpaceListComponent } from './components/reserved-space-list/reserved-space-list.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    ReservedSpaceListComponent
  ],
  imports: [
    CommonModule,
    ReservedSpacesRoutingModule,
    ComponentsModule
  ]
})
export class ReservedSpacesModule { }
