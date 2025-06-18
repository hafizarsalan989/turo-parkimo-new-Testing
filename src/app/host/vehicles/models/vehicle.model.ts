import { IBase } from "src/app/shared/models/base.model";
import { IPermit } from "../../../shared/models/parking-pass.model";

export interface IVehicle extends IBase {
  name: string;
  vin: string;
  licensePlate: string;
  licensePlateState: string;
  color: string;
  vehicleType: "Turo" | "Chase";
  make: string;
  model: string;
  engine: string;
  trim: string;
  year: number;
  imgFront: string;
  imgDriverSide: string;
  imgPassengerSide: string;
  imgRearWithPlate: string;
  notes: INote[];
  activePassCount: number;
  aviCredentialTag: string;
  fastPassId?: string;
  facilityName?: string;
  chaseVehicleEnabled?: boolean;
  parkingFacilityId?: string;
  facilityMarketId?: string;
  canRemove?: boolean; // For UI
  subscriptionId?: string;
  subscriptionMarketId?: string;
  subscriptionMarketName?: string;
  subscriptionTag?: string;
  addOnUnlimiteds?: IAddon[];
  actions?: string[];
  status?: string;
  subscriptionFacilityId?: string;
  subscriptionFacilityName?: string;
}

export interface INote {
  stamp: string;
  userId: string;
  userEmail: string;
  html: string;
  isClosed: boolean;
}

export interface IVehicleRequest extends IVehicle {
  companyId: string;
  parkingPass?: IPermit[];
}
export interface IAddon extends IBase {
  description: string;
  carParkId: string;
  carParkName: string;
  facilityId: string;
  facilityName: string;
  status: "active" | "canceled";
  cancelDate?: string;
}

export const mockVehicle: IVehicle = {
  name: "Vehicle 1",
  vin: "vin123456789",
  make: "Tesla",
  color: "Red",
  vehicleType: "Turo",
  model: "T1",
  engine: "Engine",
  trim: "Trim",
  year: 2018,
  licensePlate: "ABC123",
  licensePlateState: "CA",
  imgDriverSide: "./assets/img/card-2.jpg",
  imgPassengerSide: "./assets/img/card-2.jpg",
  imgFront: "./assets/img/card-2.jpg",
  imgRearWithPlate: "./assets/img/card-2.jpg",
  notes: [],
  activePassCount: 0,
  aviCredentialTag: "tag1",
};
