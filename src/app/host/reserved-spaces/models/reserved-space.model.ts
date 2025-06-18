import { IBase } from "src/app/shared/models/base.model";

export interface ISpace extends IBase {
  spaceNumber: number;
  status: string;
  carPark: string;
  minEndDate: string;
  monthlyRate: number;
  notes: string;
}

export const mockReservedSpace: ISpace = {
  spaceNumber: 501,
  status: "active",
  carPark: "Uncorvered",
  minEndDate: "11/01/2023",
  monthlyRate: 299,
  notes:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
};
