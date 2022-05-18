import {Observable, of} from 'rxjs';
import {GenericSearchService} from '../../common/service/GenericSearchService';
import {Orgnization} from '../model/Orgnization';
import {OrgnizationSM} from '../search-model/TransferDataSM';
import {WebClientUtil} from '../../common/util/WebClientUtil';
import {catchError} from 'rxjs/operators';

export interface OrganizationService extends GenericSearchService<Orgnization, OrgnizationSM> {
  getAllOrganization(): Observable<Orgnization>;
  getOrganizationByName(orgnizationSM: OrgnizationSM | any): Observable<Orgnization>;
  getOrganizationByOrgId(orgId: string): Observable<any>;
  getProductByOrgId(orgId: string): Observable<any>;
  getItemsByProductCatId(productCatId: string): Observable<any>;
  getGiftById(id: string, orgId: string): Observable<any>;
  getGiftByOrgId(orgId: string, searchModel: any): Observable<any>;
  insertGift(gift: any): Observable<any>;
  updateGift(id: string, gift: any): Observable<any>;
  deleteGift(id: string): Observable<any>;
  getConsumerByOrgId(orgId: string, searchModel: any): Observable<any>;
}
