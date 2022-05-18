export interface Attribute {
  name: string;
  field: string;
  type: any;
  nullable?: boolean;
  defaultValue?: any;
  primaryKey?: boolean;
  unique?: boolean;
  insertable?: boolean;
  updatable?: boolean;
  patchable?: boolean;
  length?: number;
  precision?: number;
  scale?: number;
  ignored?: boolean;
  jsonField?: string;
  sourceNameTwo: string;
}
