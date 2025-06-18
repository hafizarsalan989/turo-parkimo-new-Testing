import { IVehicle } from "src/app/host/vehicles/models/vehicle.model";
import { IBase } from "src/app/shared/models/base.model";
import { IFacility } from "../../host/vehicles/models/facility.model";

export interface IPermit extends IBase {
  subscriptionId: string;
  vehicleId: string;
  vehicle: Partial<IVehicle>;
  facility: Partial<IFacility>;
  facilityMarketId: string;
  status: string;
  barcodes: IBarcode[];
  barcodeUrls?: string[];
  monthlyPrice: number;
  aviCredentialTag: string;
  showAddOnUnlimitedButton: boolean;
  addOnUnlimiteds: IPermitAddon[];
  parkingFacilityId?: string;
  companyId?: string;
}

export interface IPermitAddon extends IBase {
  description: string;
  facilityId: string;
  carParkId: string;
  facilityName: string;
  carParkName: string;
  discounts: {
    items: IAdjustment[];
  };
  fees: {
    items: IAdjustment[];
  };
  rate: number;
  status: "active" | "canceled";
}

export interface IAdjustment {
  name: string;
  adjustmentAmount: number;
  isPercent: boolean;
  pcmsOnly: boolean;
}

export interface IBarcode {
  barcode: string;
}
