import { IBase } from "src/app/shared/models/base.model";

export interface IPool extends IBase {
  facilityId: string;
  marketId: string;
  facilityName: string;
  marketName: string;
  name: string;
  isPaidByCard: boolean;
  billingContact: IPoolContract;
  groups: IPoolGroup[];
  administratorResponse: IPoolAdmin[];
  monthlyRate: number;
  credentialFee: number;
  status: string;
}

export interface IPoolContract extends IBase {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface IPoolAdmin {
  name: string;
  id: string;
  phone: string;
  email: string;
  userId: string;
  groupIds: string[];
  role: string;
  groupNames?: string;
}
export interface IPoolGroup {
  name: string;
  id: string;
}

export interface IPoolParker extends IBase {
  name: string;
  email: string;
  phone: string;
  poolId: string;
  poolGroupId: string;
  isActive: boolean;
}
