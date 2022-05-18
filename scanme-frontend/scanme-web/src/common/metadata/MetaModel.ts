import {Attribute} from './Attribute';
import {Model} from './Model';

export class MetaModel {
  model: Model;
  primaryKeys: Attribute[];
  attributes: Attribute[];
  patchableAttributes: Attribute[];
  patchableMap: any;
  requiredAttributes: Attribute[];
  maxLengthAttributes: Attribute[];
  boolFields: string[];
  dateFields: string[];
  integerFields: string[];
  numberFields: string[];
  objectFields: MetaModel[];
  arrayFields: MetaModel[];
}
