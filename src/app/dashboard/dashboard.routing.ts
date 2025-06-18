import { Routes } from "@angular/router";

import { DashboardComponent } from "./dashboard.component";
import { RoleGuard } from "../core/guards/role.guard";
import { AuthGuard } from "../core/guards/auth.guard";

export const DashboardRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard, RoleGuard]
      },
    ],
  },
];
