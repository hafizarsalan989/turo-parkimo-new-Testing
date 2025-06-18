import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { MessageCenterRoutingModule } from "./message-center-routing.module";
import { MessageCenterListComponent } from "./components/message-center-list/message-center-list.component";
import { ComponentsModule } from "src/app/components/components.module";
import { MaterialModule } from "src/app/app.module";
import { NewMessageComponent } from './components/new-message/new-message.component';

@NgModule({
  declarations: [MessageCenterListComponent, NewMessageComponent],
  imports: [
    CommonModule,
    MessageCenterRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    CKEditorModule,
    MaterialModule,
  ],
})
export class MessageCenterModule {}
