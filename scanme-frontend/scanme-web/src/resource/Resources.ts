import AuthenticationResourceEN from '../authentication/resource/AuthenticationResourceEN';
import AuthenticationResourceTH from '../authentication/resource/AuthenticationResourceTH';
import {Language} from '../common/Language';

import CommonResourcesEN from './common/commonResourcesEN';
import CommonResourcesTH from './common/commonResourcesTH';

const ResourcesEN = {
  ...CommonResourcesEN,
  ...AuthenticationResourceEN,
};
const ResourcesTH = {
  ...CommonResourcesTH,
  ...AuthenticationResourceTH,
};

const Resources = {
  [Language.English]: ResourcesEN,
  [Language.Thai]: ResourcesTH
};

export default Resources;
