import {GenericSearchService} from '../../common/service/GenericSearchService';
import {ProviderModel} from '../model/ProviderModel';
import {ProviderSM} from '../search-model/ProviderSM';
import {Observable} from 'rxjs';

export interface ProviderService extends GenericSearchService<ProviderModel, ProviderSM>  {
    getProviderInfo(idProvider: string): Observable<any>;
    updateProviderInfo(idProvider: string, model: any): Observable<any>;
    searchLocation(location: string): Observable<any>;
}
