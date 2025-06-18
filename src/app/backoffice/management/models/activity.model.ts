import { IBase } from "src/app/shared/models/base.model";

export interface IParkingActivity extends Partial<IBase> {
  facility: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
  };
  vehicle: {
    id: string;
    name: string;
  };
  stamp: string;
  carPark: string;
  carParkName: string;
  kiosk: string;
  action: string;
  plateNumber: string;
}
