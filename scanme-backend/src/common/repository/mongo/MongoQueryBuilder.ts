import {Model} from '../../metadata/Model';
import {SearchModel} from '../../model/SearchModel';

export interface MongoQueryBuilder<S extends SearchModel> {
  buildQuery(s: S, model: Model): any;
}
