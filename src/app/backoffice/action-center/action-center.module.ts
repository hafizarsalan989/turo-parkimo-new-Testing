import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { ActionCenterRoutingModule } from "./action-center-routing.module";
import { ActionCenterListComponent } from "./components/action-center-list/action-center-list.component";
import { ComponentsModule } from "src/app/components/components.module";
import { ActionCenterComponent } from "./components/action-center/action-center.component";
import { MaterialModule } from "src/app/app.module";
import { ActionLogFileComponent } from './components/action-log-file/action-log-file.component';

@NgModule({
  declarations: [ActionCenterListComponent, ActionCenterComponent, ActionLogFileComponent],
  imports: [
    CommonModule,
    ActionCenterRoutingModule,
    ComponentsModule,
    MaterialModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class ActionCenterModule {}
