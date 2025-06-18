import { IColumnDef } from "./datatable.component";

declare const $: any;

export const defaultCol = (targets: number, data: string, title: string) => {
  return {
    title,
    targets,
    data,
    defaultContent: "",
  } as IColumnDef;
};
