import { IBase } from "src/app/shared/models/base.model";

export interface IVehicleInvoice extends IBase {
  parkimoProductType: "TURO_PARKING_ACTIVITY_CHARGE";
  data: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  unit: string;
  feeDescription: string;
  discountDescription: string;
  prorationDescription: string;
}

export interface IFeeDiscount {
  amount: number;
  name: string;
}

export const mockVehicleInvoice: IVehicleInvoice = {
  parkimoProductType: "TURO_PARKING_ACTIVITY_CHARGE",
  data: "",
  name: "",
  description: "Parking Activity",
  quantity: 3,
  rate: 10,
  amount: 30,
  unit: "Days",
  id: "63d729a8c5684321ade7cc16",
  created: "2023-01-30T02:21:28.2219973Z",
  feeDescription: "",
  discountDescription: "",
  prorationDescription: "",
};
