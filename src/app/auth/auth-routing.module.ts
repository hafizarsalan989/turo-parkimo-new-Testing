import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { VerifyEmailComponent } from "./components/verify-email/verify-email.component";
import { QueryParamsGuard } from "./guards/query-params.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
    data: { title: "Sign In" },
  },
  {
    path: "register",
    component: RegisterComponent,
    data: { title: "Sign Up" },
  },
  {
    path: "verify-email",
    component: VerifyEmailComponent,
    canActivate: [QueryParamsGuard],
    data: { title: "Verify Email" },
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    data: { title: "Reset Password" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
