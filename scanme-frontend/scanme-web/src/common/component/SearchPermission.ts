export interface SearchPermission {
  searchable: boolean;
  viewable?: boolean;
  addable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  approvable?: boolean;
}
