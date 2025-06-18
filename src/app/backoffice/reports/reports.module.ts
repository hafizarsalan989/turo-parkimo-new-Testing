import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgApexchartsModule } from "ng-apexcharts";

import { ReportsRoutingModule } from "./reports-routing.module";
import { FacilityFinancialsComponent } from "./components/facility-financials/facility-financials.component";
import { ComponentsModule } from "src/app/components/components.module";
import { FacilityOccupancyComponent } from "./components/facility-occupancy/facility-occupancy.component";
import { MaterialModule } from "src/app/app.module";
import { DeniedTagsComponent } from "./components/denied-tags/denied-tags.component";
import { CityPassCountComponent } from './components/city-pass-count/city-pass-count.component';
import { TravelerInvoicesComponent } from './components/traveler-invoices/traveler-invoices.component';
import { SystemComponent } from './components/system/system.component';
import { GuestPayComponent } from './components/guest-pay/guest-pay.component';

@NgModule({
  declarations: [
    FacilityFinancialsComponent,
    FacilityOccupancyComponent,
    DeniedTagsComponent,
    CityPassCountComponent,
    TravelerInvoicesComponent,
    SystemComponent,
    GuestPayComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ComponentsModule,
    FormsModule,
    MaterialModule,
    NgApexchartsModule,
  ],
})
export class ReportsModule {}
