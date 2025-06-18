import { IBase } from "src/app/shared/models/base.model";

export interface ISystemReport extends IBase {
  name: string;
  description: string;
  apiUrl: string;
}
