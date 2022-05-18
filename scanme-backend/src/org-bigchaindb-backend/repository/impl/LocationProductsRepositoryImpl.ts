import {Db, ObjectId} from 'mongodb';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {MongoGenericRepository} from '../../../common/repository/mongo/MongoGenericRepository';
import {MongoUtil} from '../../../common/util/MongoUtil';
import {location_productsModel} from '../../metadata/LocationProductModel';
import {LocationProducts} from '../../model/LocationProducts';
import {Products} from '../../model/Products';
import {LocationProductsRepository} from '../LocationProductsRepository';

export class LocationProductsRepositoryImpl extends MongoGenericRepository<LocationProducts> implements LocationProductsRepository {
  constructor(db: Db) {
    super(db, location_productsModel);
  }

  getLocationProductsByOrgId(orgId: string, startDate: string, endDate: string): Observable<LocationProducts[]> {
    return this.lookupLocationProductsByOrgId(orgId, startDate, endDate).pipe(flatMap(result => {
      return of(result);
    }));
  }

  private lookupLocationProductsByOrgId(orgId: string, startDate: string, endDate: string): Observable<any> {
    const collection = this.getCollection();
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    return MongoUtil.rxFindWithAggregate(collection, [
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'products'
        }
      },
      {
        $unwind: '$products'
      },
      {
        $lookup: {
          from: 'organization',
          localField: 'products.organizationId',
          foreignField: '_id',
          as: 'organization'
        }
      },
      {
        $unwind: '$organization'
      },
      {
        $match: {$and: [ {'organization._id' : orgId} , {'scanDate': { $gte: sDate, $lte: eDate }}]}
      },
      {
        $project: {
          productId: '$productId',
          productName: '$products.name',
          scanLocation: '$scanLocation',
          scanDate: '$scanDate',
          organizationId: '$organization._id',
          itemId: '$itemId',
          transactionId: '$transactionId'
        }
      }
    ]).pipe(flatMap(result => {
      if (result.length === 0) {
        return of({});
      }
      return of(result);
    }));
  }


  findById(locationProductId: string): Observable<LocationProducts> {
    const idName = this.getIdName();
    const query = {
      _id: locationProductId
    };
    return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
  }

  findByTxId(transactionId: string): Observable<number> {
    const query = {
      transactionId: transactionId
    };
    return MongoUtil.rxCount(this.getCollection(), query);

  }
}
