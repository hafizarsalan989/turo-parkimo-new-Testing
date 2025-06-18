import { IBase } from "src/app/shared/models/base.model";

export interface ITagType extends IBase {
  name: string;
  price: number;
}