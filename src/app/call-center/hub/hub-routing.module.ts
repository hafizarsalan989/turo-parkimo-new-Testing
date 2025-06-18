import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HubComponent } from "./components/hub/hub.component";

const routes: Routes = [
  {
    path: "",
    component: HubComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HubRoutingModule {}
