import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";

export const AppRoutes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "host",
        loadChildren: () =>
          import("./host/host.module").then((m) => m.HostModule),
      },
      {
        path: "facility",
        loadChildren: () =>
          import("./facility/facility.module").then((m) => m.FacilityModule),
      },
      {
        path: "backoffice",
        loadChildren: () =>
          import("./backoffice/backoffice.module").then(
            (m) => m.BackofficeModule
          ),
      },
      {
        path: "pool",
        loadChildren: () =>
          import("./pool/pool.module").then((m) => m.PoolModule),
      },
      {
        path: "callcenter",
        loadChildren: () =>
          import("./call-center/call-center.module").then(
            (m) => m.CallCenterModule
          ),
      },
      {
        path: "user",
        loadChildren: () =>
          import("./users/users.module").then((m) => m.UsersModule),
      },
      {
        path: "my-account",
        loadChildren: () =>
          import("./my-account/my-account.module").then(
            (m) => m.MyAccountModule
          ),
      },
    ],
  },
  {
    path: "external",
    loadChildren: () =>
      import("./external/external.module").then((m) => m.ExternalModule),
  },
  {
    path: "",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
];
