import {Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';

import {Authorization} from '../../authorization-model';
import {AuthorizationRepository, InviteAuthorizationRepository} from '../../authorization-repository';
import {InviteService} from '../InviteService';

export class InviteServiceImpl implements InviteService {
  constructor(
    private authorizationRepository: AuthorizationRepository,
    private inviteAuthorizationRepository: InviteAuthorizationRepository
  ) {
  }

  moveToAuthorization(email: string, userId: string): Observable<number> {
    return this.inviteAuthorizationRepository.findByEmail(email).pipe(flatMap(inviteAuthorizations => {
      if (inviteAuthorizations.length === 0) {
        return of(0);
      }

      const authorizations: Authorization[] = [];
      const ids = [];

      for (const inviteAuthorization of inviteAuthorizations) {
        const authorization = new Authorization();
        authorization.resourceId = inviteAuthorization.resourceId;
        authorization.resourceType = inviteAuthorization.resourceType;
        authorization.userId = userId;
        authorization.roleId = inviteAuthorization.roleId;

        authorizations.push(authorization);
        ids.push(inviteAuthorization.id);
      }

      return this.authorizationRepository.insertObjects(authorizations).pipe(flatMap(() => {
        return this.inviteAuthorizationRepository.deleteByIds(ids);
      }));
    }));
  }
}
