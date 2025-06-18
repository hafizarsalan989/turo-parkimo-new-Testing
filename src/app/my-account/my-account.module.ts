import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClipboardModule } from "ngx-clipboard";

import { MyAccountRoutingModule } from "./my-account-routing.module";
import { MyAccountComponent } from "./components/my-account/my-account.component";
import { MaterialModule } from "../app.module";
import { ComponentsModule } from "../components/components.module";

@NgModule({
  declarations: [MyAccountComponent],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule,
    ClipboardModule,
  ],
})
export class MyAccountModule {}
