import {Observable, of} from 'rxjs';
import { SupplyChain } from 'src/bigchaindb/model/SupplyChain';
import { SupplyChainSM } from 'src/bigchaindb/search-model/SupplyChainSM';
import {GenericSearchWebService} from '../../../common/service/webservice/GenericSearchWebService';
import { WebClientUtil } from '../../../common/util/WebClientUtil';
import {CreateProduct} from '../../model/CreateProduct';
import {StatusCode} from '../../model/StatusCode';
import {TransferRespon} from '../../model/TransferRespon';
import { SupplyChainService } from '../SupplyChainService';
import {MetaData} from '../../model/MetaData';
import {catchError} from 'rxjs/operators';
import config from '../../../config';
import {supplyChainModel} from '../../metadata/SupplyChainModel';
export class SupplyChainServiceImpl extends GenericSearchWebService<SupplyChain, SupplyChainSM> implements SupplyChainService {
  private originUrl = `${config.supplyChainServiceUrl}/`;
  constructor() {
    super(config.supplyChainServiceUrl, supplyChainModel);
  }
  getSupplyChain(supplyChainSM: SupplyChainSM): Observable<SupplyChain> {
    let url = `${this.originUrl}searchAssetsToken`;
    const keys = Object.keys(supplyChainSM);
    const params = [];
    keys.map((key) => {
      if (supplyChainSM[key] !== null) {
        params.push(key);
      }
      return params;
    });
    params.map((param) => {
      return url = url + `&${param}=` + supplyChainSM[param];
    });
    // @ts-ignore
    return WebClientUtil.get(url);
  }
  appendMetaData(transactionId: string, outputIndex: number, metaData: MetaData): Observable<any> {
    const url = `${this.originUrl}appendMetaDataToken?transactionId=` + transactionId + '&outputIndex=' + outputIndex;
    return WebClientUtil.putObject<StatusCode>(url, metaData).pipe(catchError(error => of(`error`)));
  }
  transferAsset(transactionId: string, outputIndex: number, orgId: string, metaData: MetaData): Observable<any> {
    const url = `${this.originUrl}transferAssetToken?transactionId=` + transactionId + '&outputIndex=' + outputIndex + '&orgId=' + orgId;
    return WebClientUtil.postObject<StatusCode>(url, metaData, true).pipe(catchError(error => of(`error`)));
  }
  burnAsset(transactionId: string, outputIndex: number): Observable<any> {
    const url = `${this.originUrl}burnAssetToken?transactionId=` + transactionId + '&outputIndex=' + outputIndex;
    return WebClientUtil.deleteObject<StatusCode>(url).pipe(catchError(error => of(`error`)));
  }
  divideAsset(transactionId: string, outputIndex: number, divideContent: any): Observable<any> {
    const url = `${this.originUrl}divideAssetToken?transactionId=` + transactionId + '&outputIndex=' + outputIndex;
    return WebClientUtil.putObject(url, divideContent).pipe(catchError(error => of(`error`)));
  }
  viewHistory(currentTransId: string): Observable<any> {
    const url = `${this.originUrl}getHisAssetByTransId?currentTransId=` + currentTransId;
    return WebClientUtil.getObject(url).pipe(catchError(error => of(`error`)));
  }
  createNewAsset(newProduct: CreateProduct): Observable<any> {
    const url = `${this.originUrl}createAssetToken`;
    return WebClientUtil.postRequest(url, newProduct).pipe(catchError(error => of(`error`)));
  }
  getDataAutoSearch(): Observable<any> {
    const url = `${this.originUrl}getSourcesForCreateAssetToken?` + 'isCreatorOwner=false';
    return WebClientUtil.get(url);
  }
  getSearchTransactionId(transactionId: string): Observable<any> {
    const url = `${this.originUrl}getListOuputUnspentOfTx?A6yF47Ud5GMmRi5yii77ce3xeY7ppvCNUbxubbKyuvD3`;
    const transaction = '&transactionId=' + transactionId;
    const urlLastest = url + transaction;
    return WebClientUtil.get(urlLastest);
  }
  getTransfer(name, limit):  Observable<TransferRespon> {
    const url = `${this.originUrl}getOrganizationByName?name=` + name + '&limit=' + limit;
    return WebClientUtil.getObject(url);
  }
  getAllOrganization(): Observable<any> {
    const url = `${this.originUrl}`;
    return WebClientUtil.get(url);
  }
  search(s: SupplyChainSM): Observable<any> {
    let url = `${this.originUrl}searchAssetsToken`;
    const keys = Object.keys(s);
    const params = [];
    keys.map((key) => {
      if (s[key] !== null && s[key] !== undefined && s[key] !== '') {
        params.push(key);
      }
      return params;
    });
    if (params.length > 0) {
      params.map((param, index) => {
        if (index === 0) { return url += `?${param}=` + s[param]; }
        return url += `&${param}=` + s[param];
      });
    }
    // @ts-ignore
    return WebClientUtil.get(url).pipe(catchError(error => of(`error`)));
  }
  getLocationProductsByOrgId(OrdId: string, startDate: string, endDate: string): Observable<any> {
    const url = `${this.originUrl}getLocationProductsByOrgId?startDate=${startDate}&endDate=${endDate}&orgId=${OrdId}`;
    return WebClientUtil.get(url).pipe(catchError(error => of(`error`)));
  }
  getSearchTxIdByItemIdInList(itemId: string): Observable<any> {
    const url = `${this.originUrl}getSearchTxIdByItemIdInList?itemId=${itemId}`;
    return WebClientUtil.get(url).pipe(catchError(error => of(`error`)));
  }
  importCreateAsset(assetsList: any): Observable<any> {
    const url = `${this.originUrl}importCreateAsset`;
    return WebClientUtil.postRequest(url, assetsList).pipe(catchError(error => of(`error`)));
  }
}
