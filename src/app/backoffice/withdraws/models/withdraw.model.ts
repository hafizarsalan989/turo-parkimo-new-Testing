import { IBase } from "src/app/shared/models/base.model";

export interface IWithdraw extends IBase {
  hostName: string;
  companyId: string;
  amount: number;
  status: string;
  abaNumber: string;
  accountNumber: string;
  bankName: string;
  accountOwnerName: string;
  accountOwnerPhone: string;
}
