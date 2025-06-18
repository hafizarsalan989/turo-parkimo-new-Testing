import { IBase } from "src/app/shared/models/base.model";
import { IFile } from "src/app/shared/models/file.model";

export interface IActionItem extends IBase {
  marketName: string;
  facilityName: string;
  companyName: string;
  aviCredentialTag: string;
  vehicleName: string;
  itemId: string;
  status: string;
  itemTypeId: string;
  itemTypeDescription: string;
  summary: string;
  marketId: string;
  facilityId: string;
  companyId: string;
  vehicleId: string;
  subscriptionId: string;
  fine: IActionFine;
  log: IActionLog[];
  attachments: IFile[];
  actionMenu: IActionMenu[];
}

export interface IActionFine {
  amount: number;
  status: string;
}

export interface IActionLog {
  stamp?: string;
  message: string;
  emailAddress: string;
}

export interface IActionMenu {
  id: string;
  description: string;
}
