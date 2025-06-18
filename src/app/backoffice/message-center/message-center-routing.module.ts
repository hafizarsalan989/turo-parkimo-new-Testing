import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RoleGuard } from "src/app/core/guards/role.guard";
import { MessageCenterListComponent } from "./components/message-center-list/message-center-list.component";
import { NewMessageComponent } from "./components/new-message/new-message.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list",
  },
  {
    path: "list",
    component: MessageCenterListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "Message Center" },
  },
  {
    path: "new",
    component: NewMessageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: "New Message" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageCenterRoutingModule {}
