import { IBase } from "src/app/shared/models/base.model";

export interface ICallCenterHub {
  codeType: string;
  status: string;
  company: { id: string; name: string };
  facility: { id: string; name: string };
  vehicle: { id: string; name: string };
  subscriptionId: string;
  subscription: boolean;
  unlimitedPass: boolean;
  sessions: ICallCenterHubSession[];
}

export interface ICallCenterHubSession extends IBase {
  vehicleId: string;
  facilityId: string;
  entryStamp: string;
  exitStamp: string;
  days: number;
  carPark: string;
  entryKisok: string;
  exitKiosk: string;
  status: string;
  chaseCar: boolean;
  activities: ICallCenterHubSessionActivity[];
}

export interface ICallCenterHubSessionActivity {
  id: string;
  stamp: string;
  carPark: string;
  carParkName: string;
  kiosk: string;
  action: string;
  plateNumber: string;
}
