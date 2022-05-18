export interface SearchModel {
  keyword?: string;
  sortField?: string;
  sortType?: string;
  pageIndex?: number;
  pageSize?: number;
  initPageSize?: number;
  tagName?: string;
  currentPage?: number;
  excluding?: any;
}
