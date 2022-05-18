import {ResourceType} from './ResourceType';

export class InviteAuthorization {
  id: string;
  resourceId: string;
  resourceType: ResourceType;
  email: string;
  roleId: string;
}
