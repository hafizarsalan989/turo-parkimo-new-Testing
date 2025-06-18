import { IBase } from "src/app/shared/models/base.model";

export interface IProductMax extends IBase {
  companyId: string;
  facilityId: string;
  facilityName: string;
  product: string;
  max: number;
}
