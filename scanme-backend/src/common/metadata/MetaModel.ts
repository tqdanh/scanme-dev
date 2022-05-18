import {Attribute} from './Attribute';
import {Model} from './Model';

export class MetaModel {
  model: Model;
  primaryKeys: Attribute[];
  attributes: Attribute[];
  selectableAttributes: Attribute[];
  insertableAttributes: Attribute[];
  updatableAttributes: Attribute[];
  patchableAttributes: Attribute[];
  updatableMap: any;
  patchableMap: any;
  requiredAttributes: Attribute[];
  maxLengthAttributes: Attribute[];
  boolFields: string[];
  dateFields: string[];
  integerFields: string[];
  numberFields: string[];
  map: Map<string, string>;
}
