import {Observable} from 'rxjs';
import {GenericRepository} from '../../../core';
import {User} from '../../user-model';

export interface UserRepository extends GenericRepository<User> {
  existsUserName(userName: string): Observable<boolean>;
  existsEmail(email: string): Observable<boolean>;
  findByIds(userIds: string[]): Observable<User[]>;
  findByEmail(email: string): Observable<User>;
  findByUserName(userName: string): Observable<User>;
  findByUserNameOrEmail(userName: string): Observable<Array<User>>;
  findOneByUserNameOrEmailOrOAuthEmail(email: string): Observable<User>;
}
