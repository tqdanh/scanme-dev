import {ProviderService} from '../ProviderService';
import config from '../../../config';
import {WebClientUtil} from '../../../common/util/WebClientUtil';
import {catchError} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
export class ProviderServiceImpl implements ProviderService  {
    searchTerm: any;
    constructor() {
        this.searchTerm = new Subject();
    }
    getProviderInfo(idProvider: string): Observable<any> {
        const url = `${config.providerServiceUrl}/getOrganizationByOrgId?id=${idProvider}`;
        return WebClientUtil.getObject(url).pipe(catchError(error => of(`error`)));
    }

    updateProviderInfo(idProvider: string, model: any): Observable<any> {
        const url = `${config.providerServiceUrl}/organization/${idProvider}`;
        return WebClientUtil.putObject(url, model).pipe(catchError(error => of(`error`)));
    }

    searchLocation(location: string): Observable<any> {
        this.searchTerm.next(location);
        const url = `${config.geoCodingService}/${location}.json?access_token=pk.eyJ1IjoiZG10aGFuaCIsImEiOiJjazFsdmh0MW4wOWI0M210Y25tM3Q1MGxjIn0.p0jgT4bCU319g6iFZWXldg&autocomplete=true`;
        return WebClientUtil.getObject(url).pipe(catchError(error => of(`error`)));
    }

}
