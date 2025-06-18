import { IAddress, IBase } from "src/app/shared/models/base.model";
import { IMarketPlace, IProduct } from "../../product/models/product.model";

export interface IFacility extends IBase {
  name: string;
  address: IAddress;
  monthlyMembershipFee: number;
  coordinate: ICoordinate;
  registeredVehicle?: boolean;
  imageUrl?: string;
  tagline?: string;
  images: string[];
  products?: IProduct;
  marketPlace?: IMarketPlace;
  sections?: IBase[];
  carParks: ICarPark[];
  amount?: number;
  discountedAmount?: number;
  discountPercent?: number;
  rulesUrl: string;
  airportCode: string;
  airportMarket: string;
  isTagMaster: boolean;
  status: string;
  marketId: string;
  dailyRate?: number;
  allowAddOnUnlimited: boolean;
  ownerCompanyIds?: string[];
  qrNotes?: IFacilityQrNote[];
  supportQRCodes?: boolean;
  isSubscriptionSoldOut?: boolean;
  isUnlimitedSoldOut?: boolean;
  unlimitedOnlyFacility?: boolean;
  tripFees?: ITripFee[];
}

export interface ICarPark {
  id: string;
  addOnUnlimitedRates?: {
    currentRate: {
      amount: number;
    };
  };
  name: string;
  totalSpaces: number;
  totalSpacesForTuro: number;
  dailyRate: number;
  dailyRates: IDailyRates;
  reservedSpaceRate: number;
  reservedSpaceRates?: IDailyRates;
}

export interface IDailyRates {
  currentRate: {
    amount: number;
    currentDiscountedAmount: number;
  };
}

export interface ICoordinate {
  coordinates: number[];
  type: string;
}

export interface IFacilityQrNote {
  title: string;
  note: string;
  order: number;
}

export interface ITripFee {
  id: string;
  name: string;
  fee: IFee[];
  hostPay: boolean;
  operatorPercentageSplit: number;
  created: string;
}

export interface IFee {
  name: string;
  adjustmentAmount: number;
  isPercent: boolean;
  pcmsOnly: boolean;
  startDate: string;
  endDate: string;
}

export const mockFacility: IFacility = {
  name: "Park DIA",
  address: {
    address1: "1234 xxx street",
    address2: "",
    city: "Denver",
    state: "CO",
    zip: "12345",
  },
  images: [],
  monthlyMembershipFee: 5.99,
  coordinate: {
    coordinates: [-104.68766921063096, 39.81993177611786],
    type: "Point",
  },
  carParks: [],
  rulesUrl: "",
  airportCode: "",
  airportMarket: "",
  isTagMaster: true,
  status: "",
  marketId: "",
  allowAddOnUnlimited: false,
};

export interface IMarket extends IBase {
  name: string;
  isTagMaster: boolean;
  monthlyMembershipRates: {
    currentRate: {
      currentDiscountedAmount: number;
    };
  };
  marketRulesLink?: string;
  isActive?: boolean;
}

export interface IFacilityMarket {
  market: IMarket;
  facilities: IFacility[];
}
