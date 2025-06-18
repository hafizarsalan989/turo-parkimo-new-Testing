import { IVehicle } from "../../vehicles/models/vehicle.model";

export interface IChaseCarRes {
  chaseCarsAllowed: number;
  fastPasses: Partial<IVehicle>[];
}
