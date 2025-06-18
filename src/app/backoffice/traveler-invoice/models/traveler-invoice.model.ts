import { IBase } from "src/app/shared/models/base.model";

export interface ITravelerInvoice extends IBase {
  hostName: string;
  status: string;
  billbackId: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  location: string;
  customerEmail: string;
  zipCode: string;
}
