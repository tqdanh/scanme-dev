import {Db} from 'mongodb';
import {MongoGenericRepository} from '../../../mongo-core';
import {UserSettings, userSettingsModel} from '../../user-model';
import {UserSettingsRepository} from '../../user-repository';

export class UserSettingsRepositoryImpl extends MongoGenericRepository<UserSettings> implements UserSettingsRepository {
  constructor(db: Db) {
    super(db, userSettingsModel);
  }
}
