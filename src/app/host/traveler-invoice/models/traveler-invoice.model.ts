import { IBase } from "src/app/shared/models/base.model";
import { IInvoice } from "../../invoices/models/invoice.model";

export interface ITravelerInvoice extends IBase {
  facilityName: string;
  companyId: string;
  customerEmail: string;
  customerName: string;
  customerMessage: string;
  sendEmail: boolean;
  parkingPassSubscriptionId: string;
  rentalStartDate: string;
  numberOfDays: number;
  dailyRate: number;
  fee: number;
  status: string;
  amount: number;
  total: number;
  invoice?: IInvoice;
  requireLastName: boolean;
  requireLicensePlate: boolean;
  reservationId?: string;
  pickupDate?: string;
  dropoffDate?: string;
  numberOfPassengers?: number;
}

export interface IBillbackRes {
  rows: ITravelerInvoice[];
  totalRows: number;
}
