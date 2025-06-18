import { IBase } from "src/app/shared/models/base.model";

export interface IDocument extends IBase {
  documentType: string;
  majorVersion: number;
  minorVersion: number;
  activeDate: string;
  description: string;
}
