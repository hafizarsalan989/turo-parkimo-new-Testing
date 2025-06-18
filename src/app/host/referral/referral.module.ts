import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';

import { MaterialModule } from 'src/app/app.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReferralRoutingModule } from './referral-routing.module';
import { ReferralListComponent } from './components/referral-list/referral-list.component';


@NgModule({
  declarations: [
    ReferralListComponent
  ],
  imports: [
    CommonModule,
    ReferralRoutingModule,
    MaterialModule,
    ClipboardModule,
    ComponentsModule
  ],
  exports: [ReferralListComponent]
})
export class ReferralModule { }
