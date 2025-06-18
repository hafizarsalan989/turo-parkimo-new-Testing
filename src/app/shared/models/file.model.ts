import { IBase } from "./base.model";

export interface IFile extends IBase {
  name: string;
  referenceId: string;
  referenceType: string;
  uploadedEmail: string;
  url: string;
  thumbnailUrl?: string;
}