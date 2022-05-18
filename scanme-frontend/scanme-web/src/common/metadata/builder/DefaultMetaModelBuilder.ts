import {DataType} from '../../DataType';
import {Attribute} from '../Attribute';
import {MetaModel} from '../MetaModel';
import {Model} from '../Model';
import {MetaModelBuilder} from './MetaModelBuilder';

export class DefaultMetaModelBuilder implements MetaModelBuilder {
  build(model: Model): MetaModel {
    if (model && !model.sourceName) {
      model.sourceName = model.name;
    }
    const metadata: MetaModel = new MetaModel();
    metadata.model = model;

    const primaryKeys: Attribute[] = new Array<Attribute>();
    const attributes: Attribute[] = new Array<Attribute>();
    const patchableAttributes: Attribute[] = new Array<Attribute>();
    const patchableMap = {};
    const requiredAttributes: Attribute[] = new Array<Attribute>();
    const maxLengthAttributes: Attribute[] = new Array<Attribute>();
    const boolFields = new Array<string>();
    const dateFields = new Array<string>();
    const integerFields = new Array<string>();
    const numberFields = new Array<string>();
    const objectFields = new Array<MetaModel>();
    const arrayFields = new Array<MetaModel>();
    const keys: string[] = Object.keys(model.attributes);
    for (const key of keys) {
      const attr: Attribute = model.attributes[key];
      if (attr) {
        attr.name = key;
        const mapField = key.toLowerCase();
        attributes.push(attr);
        if (attr.ignored !== true) {
          if (attr.primaryKey === true) {
            primaryKeys.push(attr);
          } else {
            if (attr.patchable !== false) {
              patchableAttributes.push(attr);
              patchableMap[attr.name] = attr;
            }
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
        } else if (attr.type === DataType.Object) {
          if (attr.typeOf) {
            objectFields.push(this.build(attr.typeOf));
          }
        } else if (attr.type === DataType.Array) {
          if (attr.typeOf) {
            arrayFields.push(this.build(attr.typeOf));
          }
        }
      }
    }
    metadata.primaryKeys = primaryKeys;
    metadata.attributes = attributes;
    metadata.patchableAttributes = patchableAttributes;
    metadata.patchableMap = patchableMap;
    metadata.requiredAttributes = requiredAttributes;
    metadata.maxLengthAttributes = maxLengthAttributes;
    metadata.boolFields = boolFields;
    metadata.dateFields = dateFields;
    metadata.integerFields = integerFields;
    metadata.numberFields = numberFields;
    metadata.objectFields = objectFields;
    metadata.arrayFields = arrayFields;
    return metadata;
  }
}
