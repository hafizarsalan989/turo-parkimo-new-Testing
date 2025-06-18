export interface ITableColumnDef {
  field: string;
  title?: string;
  format?: {
    type: IColumnType;
    param?: any;
  };
  disabled?: boolean;
  className?: string;
  showFooter?: boolean;
}

export type IColumnType = "number" | "date" | "currency" | "length" | "percent" | "html" | "files" | "link";

export interface ITableData {
  totalRows: number;
  rows: any[];
}

export interface ITableConfigs {
  page: number;
  pageSize: number;
  searchTerm?: string;
  sortColumn?: string;
  sortDirection?: "asc" | "desc" | "";
}
