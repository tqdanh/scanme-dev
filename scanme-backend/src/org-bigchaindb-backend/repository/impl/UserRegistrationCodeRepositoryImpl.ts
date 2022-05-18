import {Db} from 'mongodb';
import {MongoGenericRepository} from '../../../mongo-core';
import {userRegistrationCodeModel} from '../../model/UserRegistrationCodeModel';
import {UserRegistrationCode} from '../UserRegistrationCode';
import {UserRegistrationCodeRepository} from '../UserRegistrationCodeRepository';

export class UserRegistrationCodeRepositoryImpl extends MongoGenericRepository<UserRegistrationCode> implements UserRegistrationCodeRepository {
  constructor(db: Db) {
    super(db, userRegistrationCodeModel);
  }
}
