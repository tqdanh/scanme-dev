import {MetaModel} from '../MetaModel';
import {Model} from '../Model';

export interface MetaModelBuilder {
  build(model: Model): MetaModel;
}
