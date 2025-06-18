export interface ITravelerInvoiceReqParams {
  companyId?: string;
  status?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortColumn?: string;
  sortDirection?: string;
  startDate?: string;
  endDate?: string;
}
