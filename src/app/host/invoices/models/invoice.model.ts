import { IAddress, IBase } from "src/app/shared/models/base.model";
import {
  IVehicleInvoice,
  mockVehicleInvoice,
} from "../../vehicles/models/vehicle-invoice.model";
import { ITableData } from "src/app/components/table/table.model";

export interface IInvoice extends IBase {
  logoUrl: string;
  companyName: string;
  companyAddress: IAddress;
  supportEmail: string;
  productType: string;
  referenceId: string;
  referenceName: string;
  billedToAddress: IAddress;
  note: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  paymentMethod: string;
  paymentDate: string;
  products: IVehicleInvoice[];
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  totalRefund: number;
  maxTries: number;
  tries: number;
  canRefund: boolean;
  refunds: IRefund[];
  amountPaidCC: number;
  amountPaidPMCSBank: number;
  amountRefundCC: number;
  amountRefundPMCSBank: number;
  customerName?: string;
  reservationId?: string;
  pickupDate?: string;
  dropoffDate?: string;
  numberOfPassengers?: number;
}

export interface IRefund extends IBase {
  amount: number;
  refundType: string;
  reason: string;
}

export const mockInvoice: IInvoice = {
  logoUrl: "logoUrl",
  companyName: "companyName",
  companyAddress: {
    address1: "address1",
    address2: "address2",
    city: "city",
    state: "state",
    zip: "zip",
  },
  supportEmail: "supportEmail",
  productType: "productType",
  referenceId: "referenceId",
  referenceName: "referenceName",
  billedToAddress: {
    address1: "address1",
    address2: "address2",
    city: "city",
    state: "state",
    zip: "zip",
  },
  note: "note",
  invoiceNumber: "invoiceNumber",
  invoiceDate: "invoiceDate",
  dueDate: "dueDate",
  status: "status",
  paymentMethod: "paymentMethod",
  paymentDate: "paymentDate",
  products: [mockVehicleInvoice],
  totalAmount: 0,
  totalPaid: 0,
  totalDue: 0,
  totalRefund: 0,
  maxTries: 0,
  tries: 0,
  canRefund: true,
  refunds: [],
  amountPaidCC: 0,
  amountPaidPMCSBank: 0,
  amountRefundCC: 0,
  amountRefundPMCSBank: 0,
};

export interface IInvoiceSummary {
  annual: {
    label: string;
    totalAmount: number;
    totalPaid: number;
    amountPaidCC: number;
    amountPaidPMCSBank: number;
    totalRefund: number;
    amountRefundCC: number;
    amountRefundPMCSBank: number;
  };
  monthly: [
    {
      label: string;
      totalAmount: number;
      totalPaid: number;
      amountPaidCC: number;
      amountPaidPMCSBank: number;
      totalRefund: number;
      amountRefundCC: number;
      amountRefundPMCSBank: number;
      invoices?: ITableData;
    }
  ];
  openedMonthId: number;
}
