import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleGuard } from 'src/app/core/guards/role.guard';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    component: UserListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'User Management' }
  },
  {
    path: "add",
    component: UserEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Add User' }
  },
  {
    path: ":id/edit",
    component: UserEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { title: 'Edit User' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
