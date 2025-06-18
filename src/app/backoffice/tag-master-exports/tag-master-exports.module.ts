import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagMasterExportsRoutingModule } from './tag-master-exports-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { TagMasterExportsListComponent } from './components/tag-master-exports-list/tag-master-exports-list.component';


@NgModule({
  declarations: [
    TagMasterExportsListComponent
  ],
  imports: [
    CommonModule,
    TagMasterExportsRoutingModule,
    ComponentsModule
  ]
})
export class TagMasterExportsModule { }
