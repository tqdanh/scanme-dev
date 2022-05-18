import {Observable, of} from 'rxjs';
import {ResultInfo} from '../../../common/model/ResultInfo';
import {SearchResult} from '../../../common/model/SearchResult';
import {DefaultGenericService} from '../../../common/service/impl/DefaultGenericService';
import {GetOrgModel} from '../../model/GetOrgModel';
import {Organization} from '../../model/Organization';
import {Products} from '../../model/Products';
import { OrganizationRepository } from '../../repository/OrganizationRepository';
import {ProductsRepository} from '../../repository/ProductsRepository';
import {OrganizationService} from '../OrganizationService';
import {ProductsService} from '../ProductsService';

export class OrganizationServiceImpl extends DefaultGenericService<Organization> implements OrganizationService {

    constructor(organizationRepository: OrganizationRepository) {
        super(organizationRepository);
        this.organizationRepository = organizationRepository;
    }

    organizationRepository: OrganizationRepository;

    deleteTransaction(id): Observable<ResultInfo<Organization>> {
        return undefined;
    }

    getOrgByOrgId(orgId: string): Observable<Organization> {
        return this.organizationRepository.findByOrgId(orgId);
    }

    getOrganizationByName(getOrgModel: GetOrgModel): Observable<SearchResult<Organization>> {
        return this.organizationRepository.findOrganizationByName(getOrgModel);
    }

    getPublicKeyByOrgId(orgId: string): Observable<any> {
        return this.organizationRepository.findOrganizationAndPublicKeyByOrgID(orgId);
    }

}
