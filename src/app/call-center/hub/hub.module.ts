import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HubRoutingModule } from "./hub-routing.module";
import { HubComponent } from './components/hub/hub.component';
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  declarations: [
    HubComponent
  ],
  imports: [CommonModule, HubRoutingModule, ComponentsModule],
})
export class HubModule {}
