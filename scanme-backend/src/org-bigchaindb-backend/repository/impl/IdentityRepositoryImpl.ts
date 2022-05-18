import {Db} from 'mongodb';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {MongoGenericRepository} from '../../../common/repository/mongo/MongoGenericRepository';
import {MongoUtil} from '../../../common/util/MongoUtil';
import {identityModel, User, userModel} from '../../../shared/user-model';
import {Identity} from '../../model/Identity';
import {IdentityRepository} from '../IdentityRepository';

export class IdentityRepositoryImpl extends MongoGenericRepository<Identity> implements IdentityRepository {
    constructor(db: Db) {
        super(db, identityModel);
    }

    findByIdentityId(identityId: string): Observable<Identity> {
        const idName = this.getIdName();
        // return MongoUtil.rxFindOne(this.getCollection(), {identityId: identityId}).pipe(map(obj => MongoUtil.map(obj, idName)));
        return MongoUtil.rxFindOne(this.getCollection(), {_id: identityId}).pipe(map(obj => MongoUtil.map(obj, idName)));
    }

    findByUserId(userId: string): Observable<Identity> {
        return this.lookupIdentityByUserId(userId).pipe(flatMap(result => {
            return of(result);
        }));
    }

    private lookupIdentityByUserId(userId: string): Observable<Identity> {
        const query = {
            _id: userId
        };
        const collection = this.db.collection('user');
        // const colection = this.getCollection();
        return MongoUtil.rxFindWithAggregate(collection, [
            {
                $match: query
            }
            , {
                $lookup: {
                    from: 'organization',
                    localField: 'organizationId',
                    foreignField: '_id',
                    as: 'organization'
                }
            },
            {
                $unwind: '$organization'
            },
            {
                $lookup: {
                    from: 'identity',
                    localField: 'organization.identityId',
                    foreignField: '_id',
                    as: 'identity'
                }

            }]).pipe(flatMap(result => {
            if (result.length === 0) {
                return of({});
            }
            return of(result[0]['identity'][0]);
        }));
    }
}
