import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductRoutingModule } from "./product-routing.module";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { ComponentsModule } from "src/app/components/components.module";
import { MaterialModule } from "src/app/app.module";

@NgModule({
  declarations: [ProductListComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ComponentsModule,
    MaterialModule,
  ],
})
export class ProductModule {}
