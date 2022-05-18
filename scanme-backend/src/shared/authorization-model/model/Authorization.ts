import {ResourceType} from './ResourceType';

export class Authorization {
  id: string;
  resourceId: string;
  resourceType: ResourceType;
  userId: string;
  roleId: string;
}
