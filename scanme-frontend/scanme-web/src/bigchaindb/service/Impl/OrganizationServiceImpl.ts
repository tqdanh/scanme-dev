import { Observable, of } from 'rxjs';
import { WebClientUtil } from '../../../common/util/WebClientUtil';
import {Orgnization} from '../../model/Orgnization';
import {OrgnizationSM} from '../../search-model/TransferDataSM';
import {OrganizationService} from '../OrganizationService';
import { catchError } from 'rxjs/operators';
import config from '../../../config';
export class OrganizationServiceImpl implements OrganizationService {
  private originUrl = `${config.organizationServiceUrl}/`;
  getAllOrganization(): Observable<Orgnization> {
    const url = `${this.originUrl}getOrganizationByName`;
    return WebClientUtil.getObject(url);
  }
  getOrganizationByName(orgnizationSM: OrgnizationSM): Observable<Orgnization> {
    let url = `${this.originUrl}getOrganizationByName`;
    const keys = Object.keys(orgnizationSM);
    const params = [];
    keys.map((key) => {
      if (orgnizationSM[key] !== null) {
        params.push(key);
      }
    });
    params.map((param, index) => {
      if (index === 0) {
        url = url + `?${param}=` + orgnizationSM[param];
      } else {
        url = url + `&${param}=` + orgnizationSM[param];
      }
    });
    return WebClientUtil.getObject(url);
  }
  getOrganizationByOrgId(orgId: string): Observable<any> {
    const url = `${this.originUrl}getOrganizationByOrgId?id=` + orgId;
    return WebClientUtil.getObject(url).pipe(catchError(error => of(`error`)));
  }
  getProductByOrgId(orgId: string): Observable<any> {
    const url = `${this.originUrl}getProductByOrgId?orgId=` + orgId;
    return WebClientUtil.getObject(url);
  }
  getItemsByProductCatId(productCatId: string, actionCode: number = 0): Observable<any> {
    const url = `${this.originUrl}getItem?productCatId=${productCatId}&actionCode=${actionCode}`;
    return WebClientUtil.getObject(url).pipe(catchError(error => of(`error`)));
  }
  getGiftById(id: string, orgId: string): Observable<any> {
    const url = `${this.originUrl}getGift?orgId=${orgId}&_id=${id}`;
    return WebClientUtil.getObject(url).pipe(catchError(error => of(`error`)));
  }
  getGiftByOrgId(orgId: string, searchModel: any): Observable<any> {
    let url = `${this.originUrl}getGift?orgId=${orgId}`;
    if (searchModel.pageSize) {
      url += `&pageSize=${searchModel.pageSize}`;
    }
    if (searchModel.pageIndex) {
      url += `&pageIndex=${searchModel.pageIndex}`;
    }
    if (searchModel.expiryDate) {
      url += `&expiryDate=${searchModel.expiryDate}`;
    }
    return WebClientUtil.getObject(url).pipe(catchError(error => of(`error`)));
  }
  insertGift(gift: any): Observable<any> {
    const url = `${this.originUrl}gift`;
    return WebClientUtil.postObject(url, gift).pipe(catchError(error => of(`error`)));
  }
  updateGift(id: string, gift: any): Observable<any> {
    const url = `${this.originUrl}gift/${id}`;
    return WebClientUtil.putObject(url, gift).pipe(catchError(error => of(`error`)));
  }
  deleteGift(id: string): Observable<any> {
    const url = `${this.originUrl}gift/${id}`;
    return WebClientUtil.deleteObject(url).pipe(catchError(error => of(`error`)));
  }
  getConsumerByOrgId(orgId: string, searchModel: any): Observable<any> {
    let url = `${this.originUrl}getConsumerByOrgId?orgId=${orgId}`;
    if (searchModel.pageSize) {
      url += `&pageSize=${searchModel.pageSize}`;
    }
    if (searchModel.pageIndex) {
      url += `&pageIndex=${searchModel.pageIndex}`;
    }
    return WebClientUtil.getObject(url).pipe(catchError(error => of(`error`)));
  }
}
