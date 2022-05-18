import {MongoGenericRepository, MongoUtil} from '../../../mongo-core';
import {Authentication, authenticationModel} from '../../user-model';
import {AuthenticationRepository} from '../../user-repository';

export class AuthenticationRepositoryImpl extends MongoGenericRepository<Authentication> implements AuthenticationRepository {
  constructor(mongo) {
    super(mongo, authenticationModel);
  }
}
