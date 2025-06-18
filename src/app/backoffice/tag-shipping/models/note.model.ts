import { IBase } from "src/app/shared/models/base.model";
import { IFile } from "src/app/shared/models/file.model";

export interface INote extends IBase {
  userId: string;
  userEmail: string;
  message: string;
  noteType: string;
  referenceType: string;
  referenceId: string;
  files?: IFile[];
}
