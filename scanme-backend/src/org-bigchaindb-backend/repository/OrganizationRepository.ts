import {Observable} from 'rxjs';
import {SearchResult} from '../../common/model/SearchResult';
import {GenericRepository} from '../../common/repository/GenericRepository';
import {GetOrgModel} from '../model/GetOrgModel';
import {Organization} from '../model/Organization';


export interface OrganizationRepository extends GenericRepository<Organization>  {
  findOrganizationByName(getOrgModel: GetOrgModel): Observable<SearchResult<Organization>>;
  findOrganizationAndPublicKeyByOrgID(orgId: string): Observable<any>;
  findByEmail(email: string): Observable<Organization[]>;
  findByOrgId(orgId: string): Observable<Organization>;
  findByIds(orgIds: string[]): Observable<Organization[]>;
  insert(organization: Organization): Observable<Organization>;
}
