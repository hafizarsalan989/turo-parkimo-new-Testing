import { IBase, IAddress } from "src/app/shared/models/base.model";
import { ICard } from "src/app/shared/models/card-on-file.model";

export interface IHost extends IBase {
  companyName?: string;
  mailingPreference: string;
  name?: string;
  address: IAddress;
  mailingAddress: IAddress;
  ownerId: string;
  status: string;
  primaryCard?: ICard;
  secondaryCard?: ICard;
  gatewayCustomerId?: string;
  activeFacilityCount?: number;
  activeVehicleCount?: number;
  activeFastpassCount?: number;
  activeReserveSpaceCount?: number;
  activityLast90Days?: number;
  revenueLast90Days?: number;
  users?: string[];
  allowBillback?: boolean;
  pauseBilling?: boolean;
  allowAddOnUnlimited?: boolean;
  ignoreDailyParkingPMCSFee?: boolean;
  suspended?: boolean;
  allowGuestRegistration?: boolean;
  withdrawalLimit?: number;
  autoWithdrawal?: boolean;
  referralCode?: string;
  ach?: {
    abaNumber: string;
    accountNumber: string;
    bankName: string;
    accountOwnerName: string;
    accountOwnerPhone: string;
  };
  twoFactorAuthFacilities?: string[];
  chaseCarMax?: IChaseCarMax[];
  rentalPlatformUsername: string;
}

export interface IChaseCarMax {
  facilityId: string;
  max: number;
}

export const mockHost: IHost = {
  companyName: "Milenkovic",
  mailingPreference: "standard",
  address: {
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  },
  mailingAddress: {
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  },
  ownerId: "63ec6a4f5759fff83289c1a2",
  status: "created",
  id: "63ec6a515759fff83289c1a5",
  created: "2023-02-15T05:14:57.3650000Z",
  modified: "2023-02-15T05:14:57.3650000Z",
  isDeleted: false,
  chaseCarMax: [{ facilityId: "642ef9fd6b63f3304f8e8583", max: 2 }],
  rentalPlatformUsername: "Danijel",
};

export interface IMailingPreferenceOption extends IBase {
  name: "String";
  price: 0;
}

export interface ISimpleHost {
  companyId: string;
  companyName: string;
  ownerName: string;
  ownerEmail: string;
}
export interface ICalculator {
  avgTripPerVehiclePerMonth: number;
  avgCostPerTrip: number;
  totalPaid: number;
  totalTrips: number;
  percentDailyParking: number;
  percentReservedParking: number;
  percentUnlimitedPass: number;
  percentCoveredByFuelTank: number;
  amountUsedFromFuelTank: number;
  oldestPaymentDate: string;
  newestPaymentDate: string;
}