import { IBase } from "src/app/shared/models/base.model";
import { IHost, mockHost } from "src/app/host/models/host.model";
import {
  IFacility,
  mockFacility,
} from "src/app/host/vehicles/models/facility.model";
import {
  IVehicle,
  mockVehicle,
} from "src/app/host/vehicles/models/vehicle.model";

export interface IWorkQueue extends IBase {
  action: string;
  facility: Partial<IFacility>;
  host: Partial<IHost>;
  vehicle: Partial<IVehicle>;
  metadata: string;
  status: string;
  referenceId: string;
  referenceType: string;
}

export const mockWorkQueue = {
  action: "Review and Create",
  facility: mockFacility,
  host: mockHost,
  vehicle: mockVehicle,
  metadata: "LD8QG28JPFC7FYQ",
  status: "pending",
};
