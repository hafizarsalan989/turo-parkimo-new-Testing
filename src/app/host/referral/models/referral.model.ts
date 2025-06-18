import { IBase } from "src/app/shared/models/base.model";

export interface IReferral extends IBase {
  companyName: string;
  companyId: string;
  referredCompanyId: string;
  referralPercentage: number;
  startDate: string;
  endDate: string;
  totalEarned: number;
  totalPaid: number;
}

export interface IReferralActivity extends IBase {
  facilityName: string;
  invoiceDate: string;
  invoiceId: string;
  referralId: string;
  companyId: string;
  referredCompanyId: string;
  facilityId: string;
  amount: number;
}
