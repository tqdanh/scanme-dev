import {Model} from '../metadata/Model';
import {MetadataUtil} from '../metadata/util/MetadataUtil';

export class IdBuilder {
  static buildId(metadata: Model, props: any): any {
    const metaModel = MetadataUtil.getMetaModel(metadata);
    if (!metaModel.primaryKeys || metaModel.primaryKeys.length <= 0) {
      return null;
    } else {
      const id: any = {};
      const sp = (props.match ? props : props['props']);
      for (const key of metaModel.primaryKeys) {
        let v = sp.match.params[key.name];
        if (!v) {
          v = sp[key.name];
          if (!v) {
            return null;
          }
        }
        id[key.name] = v;
      }
      return id;
    }
  }
}
