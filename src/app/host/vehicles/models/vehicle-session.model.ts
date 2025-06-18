import { IBase } from "src/app/shared/models/base.model";
import { IFacility, mockFacility } from "./facility.model";
import { IVehicle, mockVehicle } from "./vehicle.model";

export interface ISession extends IBase {
  facility: Partial<IFacility>;
  vehicle: Partial<IVehicle>;
  entryStamp: string;
  exitStamp: string | null;
  days: number;
  amount: number;
  activities: IActivity[];
}

export const mockSession: ISession = {
  facility: mockFacility,
  vehicle: mockVehicle,
  entryStamp: "1/6/2023 08:00 AM",
  exitStamp: null,
  days: 0,
  amount: 4.25,
  activities: [],
};

export interface IActivity extends Partial<IBase> {
  action: string;
  carPark: string;
  kiosk: string;
  stamp: string;
}

export const mockActivity: IActivity = {
  id: "63d14a1c66687e55040f6ebb",
  stamp: "2022-07-19T16:14:30.0000000Z",
  carPark: "uncovered",
  kiosk: "exit ln 2 (center)",
  action: "exit",
};
