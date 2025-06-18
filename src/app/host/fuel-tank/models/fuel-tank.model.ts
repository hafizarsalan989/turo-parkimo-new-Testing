import { IBase } from "src/app/shared/models/base.model";

export interface FuelTank extends IBase {
  companyId: string;
  currentBalance: number;
  totalInvoicePayments: number;
  totalWithdrawalAvailable: number;
  totalWithdrawals: number;
  ledger: FuelTankLedger[];
}

export interface FuelTankLedger extends IBase {
  companyBankId: string;
  companyId: string;
  ledgerType: string;
  stamp: string;
  referenceId: string;
  referenceType: string;
  amount: number;
}
