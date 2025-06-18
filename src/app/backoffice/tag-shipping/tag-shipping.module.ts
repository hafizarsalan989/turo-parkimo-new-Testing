import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClipboardModule } from "ngx-clipboard";

import { MaterialModule } from "src/app/app.module";
import { TagShippingRoutingModule } from "./tag-shipping-routing.module";
import { TagShippingComponent } from "./components/tag-shipping/tag-shipping.component";
import { FormsModule } from "@angular/forms";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  declarations: [TagShippingComponent],
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    TagShippingRoutingModule,
    MaterialModule,
    ComponentsModule
  ],
})
export class TagShippingModule {}
