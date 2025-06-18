import { NgModule } from "@angular/core";
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgxMaskModule } from "ngx-mask";
import { NgImageFullscreenViewModule } from "ng-image-fullscreen-view";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { NgApexchartsModule } from "ng-apexcharts";
import { ClipboardModule } from "ngx-clipboard";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { MaterialModule } from "../app.module";
import { ImgPickerComponent } from "./img-picker/img-picker.component";
import { CreditCardModalComponent } from "./credit-card-modal/credit-card-modal.component";
import { ImgViewerComponent } from "./img-viewer/img-viewer.component";
import { CancelPermitModalComponent } from "./cancel-permit-modal/cancel-permit-modal.component";
import { VehicleListTableComponent } from "./vehicle-list-table/vehicle-list-table.component";
import { PermitListTableComponent } from "./permit-list-table/permit-list-table.component";
import { ReservedSpaceListTableComponent } from "./reserved-space-list-table/reserved-space-list-table.component";
import { InvoiceListTableComponent } from "./invoice-list-table/invoice-list-table.component";
import { UserListTableComponent } from "./user-list-table/user-list-table.component";
import { SessionListTableComponent } from "./session-list-table/session-list-table.component";
import { ActivityListModalComponent } from "./activity-list-modal/activity-list-modal.component";
import { FacilityDetailsModalComponent } from "./facility-details-modal/facility-details-modal.component";
import { DataTableComponent } from "./datatable/datatable.component";
import { SessionCloseModalComponent } from "./session-close-modal/session-close-modal.component";
import { PermitReplaceTagModalComponent } from "./permit-replace-tag-modal/permit-replace-tag-modal.component";
import { TableComponent } from "./table/table.component";
import { FuelTankComponent } from "./fuel-tank/fuel-tank.component";
import { TravelInvoiceComponent } from "./traveler-invoice/traveler-invoice.component";
import { FacilityFinancialsComponent } from "./facility-financials/facility-financials.component";
import { DaterangePickerComponent } from "./daterange-picker/daterange-picker.component";
import { ChartComponent } from "./chart/chart.component";
import { TagListTableComponent } from "./tag-list-table/tag-list-table.component";
import { InvoiceSummaryModalComponent } from './invoice-summary-modal/invoice-summary-modal.component';
import { NotesModalComponent } from './notes-modal/notes-modal.component';
import { HostNoteListTableComponent } from './host-note-list-table/host-note-list-table.component';
import { ChaseCarComponent } from './chase-car/chase-car.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { CallCenterHubComponent } from './call-center-hub/call-center-hub.component';
import { ContractParkingPoolManagementComponent } from './contract-parking-pool-management/contract-parking-pool-management.component';
import { LocationsComponent } from './locations/locations.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskModule.forRoot(),
    NgImageFullscreenViewModule,
    SlickCarouselModule,
    NgxDaterangepickerMd.forRoot(),
    NgApexchartsModule,
    ClipboardModule,
    CKEditorModule
  ],
  declarations: [
    ImgPickerComponent,
    CreditCardModalComponent,
    ImgViewerComponent,
    CancelPermitModalComponent,
    VehicleListTableComponent,
    PermitListTableComponent,
    ReservedSpaceListTableComponent,
    InvoiceListTableComponent,
    UserListTableComponent,
    SessionListTableComponent,
    ActivityListModalComponent,
    FacilityDetailsModalComponent,
    DataTableComponent,
    SessionCloseModalComponent,
    PermitReplaceTagModalComponent,
    TableComponent,
    FuelTankComponent,
    TravelInvoiceComponent,
    FacilityFinancialsComponent,
    DaterangePickerComponent,
    ChartComponent,
    TagListTableComponent,
    InvoiceSummaryModalComponent,
    NotesModalComponent,
    HostNoteListTableComponent,
    ChaseCarComponent,
    QrCodeComponent,
    CallCenterHubComponent,
    ContractParkingPoolManagementComponent,
    LocationsComponent,
  ],
  exports: [
    ImgPickerComponent,
    CreditCardModalComponent,
    ImgViewerComponent,
    CancelPermitModalComponent,
    VehicleListTableComponent,
    PermitListTableComponent,
    ReservedSpaceListTableComponent,
    InvoiceListTableComponent,
    UserListTableComponent,
    SessionListTableComponent,
    PermitReplaceTagModalComponent,
    ActivityListModalComponent,
    FacilityDetailsModalComponent,
    DataTableComponent,
    TableComponent,
    FuelTankComponent,
    TravelInvoiceComponent,
    FacilityFinancialsComponent,
    DaterangePickerComponent,
    ChartComponent,
    TagListTableComponent,
    InvoiceSummaryModalComponent,
    NotesModalComponent,
    HostNoteListTableComponent,
    ChaseCarComponent,
    QrCodeComponent,
    CallCenterHubComponent,
    ContractParkingPoolManagementComponent,
    LocationsComponent,
  ],
  providers: [CurrencyPipe, DecimalPipe, DatePipe, TitleCasePipe],
})
export class ComponentsModule {}
