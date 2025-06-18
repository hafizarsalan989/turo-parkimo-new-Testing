import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { MaterialModule } from 'src/app/app.module';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    UserListComponent,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UsersRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    ComponentsModule
  ]
})
export class UsersModule { }
