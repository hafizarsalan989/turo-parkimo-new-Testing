import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RoleGuard } from "src/app/core/guards/role.guard";
import { QueueListComponent } from "./components/queue-list/queue-list.component";
import { QueueViewComponent } from "./components/queue-view/queue-view.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    component: QueueListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Queue List" },
  },
  {
    path: ":id/view",
    component: QueueViewComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Queue View" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkQueueRoutingModule {}
