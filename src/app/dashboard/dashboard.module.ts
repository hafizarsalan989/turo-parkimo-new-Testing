import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutes } from "./dashboard.routing";
import { MaterialModule } from "../app.module";
import { ComponentsModule } from "../components/components.module";


// @NgModule({
//   imports: [
//     CommonModule,
//     RouterModule.forChild(DashboardRoutes),
//     FormsModule,
//     MaterialModule,
//     ComponentsModule,
    
//   ],
//   declarations: [DashboardComponent],
// })

// export class DashboardModule {}
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    MaterialModule,
    ComponentsModule,
  ],
  declarations: [DashboardComponent], // ✅ now allowed
})
export class DashboardModule {}

