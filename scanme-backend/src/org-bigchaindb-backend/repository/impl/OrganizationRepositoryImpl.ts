import {Db} from 'mongodb';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {SearchResult} from '../../../common/model/SearchResult';
import {MongoGenericRepository} from '../../../common/repository/mongo/MongoGenericRepository';
import {MongoUtil} from '../../../common/util/MongoUtil';
import {organizationModel} from '../../metadata/OrganizationModel';
import {GetOrgModel} from '../../model/GetOrgModel';
import {Organization} from '../../model/Organization';
import {OrganizationRepository} from '../OrganizationRepository';

export class OrganizationRepositoryImpl extends MongoGenericRepository<Organization> implements OrganizationRepository {
    constructor(db: Db) {
        super(db, organizationModel);
    }

    findOrganizationByName(getOrgModel: GetOrgModel): Observable<SearchResult<Organization>> {
        const collection = this.getCollection();
        const searchResult = new SearchResult<Organization>();
        const query = {};
        if (getOrgModel.name !== null) {
            const orgName = getOrgModel.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query['organizationName'] = {'$regex': orgName};
        }
        let sort = null;
        if (getOrgModel.sortField && getOrgModel.sortType && (getOrgModel.sortType === 'ASC' || getOrgModel.sortType === 'DESC')) {
            sort = {
                [getOrgModel.sortField]: getOrgModel.sortType === 'ASC' ? 1 : -1
            };
        }
        return MongoUtil.rxFind<Organization>(collection, query, sort, getOrgModel.pageSize, (getOrgModel.pageIndex - 1) * getOrgModel.pageSize).pipe(flatMap(result => {
            const result1: Organization[]  = result;
            searchResult.itemTotal = result.length;
            searchResult.results = result;
            return of(searchResult);
        }));
    }

    findOrganizationAndPublicKeyByOrgID(orgId: string): Observable<any> { // Return just public key
        const collection = this.getCollection();
        // const query = {
        //     organizationId: orgId
        // };
        const query = {
            _id: orgId
        };
        return MongoUtil.rxFindWithAggregate(collection, [{
            $match: query
        }, {
            $lookup:
                {
                    from: 'identity',
                    localField: 'identityId',
                    foreignField: '_id',
                    as: 'ofidentity'
                }
        }]).pipe(flatMap(result => {
            if (result.length === 0) {
                return of({});
            }
            const result1 = result[0];
            const ofidentity = result1['ofidentity'];
            const ofidentityright = ofidentity.filter(item => {
                if (result1['identityId'] === item['_id']) {
                    return true;
                }
            });
            result1['publicKey'] = ofidentityright[0]['publicKey'];
            delete result1['ofidentity'];
            return of(result1['publicKey']);
        }));
    }

    findByEmail(email: string): Observable<Organization[]> {
        const idName = this.getIdName();
        const query = {
            email: email
        };
        return MongoUtil.rxFind(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
    }

    findByOrgId(orgId: string): Observable<Organization> {
        const idName = this.getIdName();
        const query = {
            _id: orgId
        };
        return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
    }

    findByIds(orgIds: string[]): Observable<Organization[]> {
        const idName = this.getIdName();
        const query = {_id: {'$in': orgIds}};
        return MongoUtil.rxFind(this.getCollection(), query).pipe(map(obj => MongoUtil.mapArray(obj, idName)));
    }

}
