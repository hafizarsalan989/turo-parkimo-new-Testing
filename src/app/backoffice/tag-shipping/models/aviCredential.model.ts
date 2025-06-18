import {
  IHost,
  IMailingPreferenceOption,
} from "src/app/host/models/host.model";
import { IVehicle } from "src/app/host/vehicles/models/vehicle.model";
import { IBase } from "src/app/shared/models/base.model";

export interface IAviCredential {
  company: IHost;
  companyOwnerEmail: string;
  oldestRequest: string;
  shippingOption: IMailingPreferenceOption;
  vehicles: IVehicle[];
  tags: any[];
}
export interface IAviCredentialStatus extends IBase {
  vehicleName: string;
  companyId: string;
  tag: string;
  tagTypeId: string;
  status: string;
  shippingOption: {
    name: string;
    price: 0;
    id: string;
    created: string;
    modified: string;
    isDeleted: boolean;
  };
}
