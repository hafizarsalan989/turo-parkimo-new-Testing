import { IHost } from "src/app/host/models/host.model";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { IDocument } from "src/app/backoffice/management/models/document.model";
import { IBase, IAddress } from "./base.model";

export interface IUser extends IBase {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  rentalPlatformUsername: string;
  vehicleCount: number;
  market: string;
  roles: IRole[];
  turoUserType: "host" | "facility" | "backoffice" | "pool";
  forcePasswordChange?: boolean;
  isEmailVerified?: boolean;
  phoneNumbers: IPhone[];
  addresses: IAddress[];
  facilities?: Partial<IFacility>[];
  host?: Partial<IHost>;
  isFinancialAdmin?: boolean;
  verifyId?: string;
  verificationCode?: string;
  documentsNeedingAgreement?: IDocument[];
}
export interface IRole {
  roleName: string;
  product: string;
}

export interface IPhone {
  type: string;
  number: string;
  canSMS?: boolean;
}

export const mockUser: IUser = {
  firstname: "Dan",
  lastname: "M",
  email: "webdeveloper711@gmail.com",
  phone: "(123) 123-1233",
  rentalPlatformUsername: "RTracy",
  vehicleCount: 1,
  market: "Albuquerque, NM",
  password: "x3Pofsc8aja1Mb4n9LKlhyAb6hKcVj2VV3Hx76htvDo=",
  roles: [
    {
      roleName: "admin",
      product: "Turo",
    },
  ],
  turoUserType: "host",
  forcePasswordChange: false,
  isEmailVerified: true,
  phoneNumbers: [],
  addresses: [
    {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
    },
  ],
  hash: "DED843573E421C66771B60E999C5140C",
  id: "63c56c9a197072c74e381d14",
  created: "2023-02-03T23:36:25.5910000Z",
  modified: "2023-02-08T14:12:22.1980000Z",
  isDeleted: false,
};
