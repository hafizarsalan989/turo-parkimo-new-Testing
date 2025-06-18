import { IBase } from "src/app/shared/models/base.model";

export interface IQrCode extends IBase {
  companyId: string;
  facilityId: string;
  barcode: string;
  expirationDate: string;
  expiryInDate?: string;
  status: string;
}
