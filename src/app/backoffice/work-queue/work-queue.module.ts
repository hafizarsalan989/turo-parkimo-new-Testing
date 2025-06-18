import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { WorkQueueRoutingModule } from "./work-queue-routing.module";
import { QueueListComponent } from "./components/queue-list/queue-list.component";
import { QueueViewComponent } from "./components/queue-view/queue-view.component";
import { ComponentsModule } from "src/app/components/components.module";
import { MaterialModule } from "src/app/app.module";

@NgModule({
  declarations: [QueueListComponent, QueueViewComponent],
  imports: [
    CommonModule,
    WorkQueueRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
})
export class WorkQueueModule {}
