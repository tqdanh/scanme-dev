import {Db} from 'mongodb';
import {BaseRepository} from '../BaseRepository';

export class BaseMongoRepository implements BaseRepository {
  constructor(protected db: Db) {}
}
