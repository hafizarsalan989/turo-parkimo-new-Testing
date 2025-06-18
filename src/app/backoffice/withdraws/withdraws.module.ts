import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { WithdrawsRoutingModule } from "./withdraws-routing.module";
import { WithdrawsComponent } from "./components/withdraws/withdraws.component";
import { ComponentsModule } from "src/app/components/components.module";
import { MaterialModule } from "src/app/app.module";

@NgModule({
  declarations: [WithdrawsComponent],
  imports: [
    CommonModule,
    WithdrawsRoutingModule,
    ComponentsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class WithdrawsModule {}
