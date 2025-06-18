import { IInvoice } from "src/app/host/invoices/models/invoice.model";
import { IBase } from "src/app/shared/models/base.model";

export interface IQuickTravelerInvoice extends IBase {
  facilityName: string;
  companyId: string;
  facilityId: string;
  travelerInvoiceParkingFee: number;
  percentPassThrough: number;
  pmcsFee: number;
  message: string;
  urlKey: string;
  isEnabled: boolean;
  // guestPayEnabled: boolean;
  requireLicensePlate: boolean;
  requireLastName: boolean;
  facilitySelfPay: boolean;
  tripCharges: IQuickTravelerInvoiceTripCharge[];
  minimumTravelerInvoiceParkingFee: number;
  minimumTravelerInvoiceParkingFeePercent: number;
}

export interface IQuickTravelerInvoiceDetails {
  invoice: IInvoice;
  travelerQuickInvoice: IQuickTravelerInvoice;
}

export interface IQuickTravelerInvoiceTripCharge {
  name: string;
  amount: number;
}
