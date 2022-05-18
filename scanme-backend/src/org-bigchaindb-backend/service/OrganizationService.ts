import {Observable} from 'rxjs';
import {SearchResult} from '../../common/model/SearchResult';
import {DefaultGenericService} from '../../common/service/impl/DefaultGenericService';
import {GetOrgModel} from '../model/GetOrgModel';
import {Organization} from '../model/Organization';
import {Products} from '../model/Products';

export interface OrganizationService extends DefaultGenericService<Organization> {
    getOrganizationByName(getOrgModel: GetOrgModel): Observable<SearchResult<Organization>>;
    getPublicKeyByOrgId(orgId: string): Observable<any>;
    getOrgByOrgId(orgId: string): Observable<Organization>;
}
