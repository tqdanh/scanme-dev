import {DataType} from '../../DataType';
import {Attribute} from '../Attribute';
import {MetaModel} from '../MetaModel';
import {Model} from '../Model';
import {MetaModelBuilder} from './MetaModelBuilder';

export class DefaultMetaModelBuilder implements MetaModelBuilder {
  build(model: Model): MetaModel {
    if (!model.sourceName) {
      model.sourceName = model.name;
    }
    const metadata: MetaModel = new MetaModel();
    metadata.model = model;

    const primaryKeys: Attribute[] = new Array<Attribute>();
    const attributes: Attribute[] = new Array<Attribute>();
    const selectableAttributes: Attribute[] = new Array<Attribute>();
    const insertableAttributes: Attribute[] = new Array<Attribute>();
    const updatableAttributes: Attribute[] = new Array<Attribute>();
    const updatableMap = {};
    const patchableAttributes: Attribute[] = new Array<Attribute>();
    const patchableMap = {};
    const requiredAttributes: Attribute[] = new Array<Attribute>();
    const maxLengthAttributes: Attribute[] = new Array<Attribute>();
    const boolFields = new Array<string>();
    const dateFields = new Array<string>();
    const integerFields = new Array<string>();
    const numberFields = new Array<string>();
    const map = new Map<string, string>();
    const keys: string[] = Object.keys(model.attributes);
    for (const key of keys) {
      const attr: Attribute = model.attributes[key];
      attr.name = key;
      const mapField = (attr.field ? attr.field.toLowerCase() : key.toLowerCase());
      attributes.push(attr);
      if (mapField !== key) {
        map[mapField] = key;
      }
      if (attr.ignored !== true) {
        if (attr.primaryKey === true) {
          primaryKeys.push(attr);
          selectableAttributes.push(attr);
        } else {
          selectableAttributes.push(attr);
          if (attr.updatable !== false) {
            updatableAttributes.push(attr);
            updatableMap[attr.name] = attr;
          }
          if (attr.patchable !== false) {
            patchableAttributes.push(attr);
            patchableMap[attr.name] = attr;
          }
        }
        if (attr.insertable !== false) {
          insertableAttributes.push(attr);
        }
        if (attr.nullable === false) {
          requiredAttributes.push(attr);
        }
        if (attr.length > 0) {
          maxLengthAttributes.push(attr);
        }
      }
      if (attr.type === DataType.DateTime) {
        dateFields.push(attr.name);
      } else if (attr.type === DataType.Bool) {
        boolFields.push(attr.name);
      } else if (attr.type === DataType.Integer) {
        integerFields.push(attr.name);
      } else if (attr.type === DataType.Number)   {
        numberFields.push(attr.name);
      }
    }
    metadata.map = map;
    metadata.primaryKeys = primaryKeys;
    metadata.attributes = attributes;
    metadata.selectableAttributes =  selectableAttributes;
    metadata.insertableAttributes = insertableAttributes;
    metadata.updatableAttributes = updatableAttributes;
    metadata.updatableMap = updatableMap;
    metadata.patchableAttributes = patchableAttributes;
    metadata.patchableMap = patchableMap;
    metadata.requiredAttributes = requiredAttributes;
    metadata.maxLengthAttributes = maxLengthAttributes;
    metadata.boolFields = boolFields;
    metadata.dateFields = dateFields;
    metadata.integerFields = integerFields;
    metadata.numberFields = numberFields;
    return metadata;
  }
}
