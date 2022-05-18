import {Observable} from 'rxjs';
import {GenericSearchService} from '../../common/service/GenericSearchService';
import {CreateProduct} from '../model/CreateProduct';
import {Orgnization} from '../model/Orgnization';
import { SupplyChain } from '../model/SupplyChain';
import { TransactionRespon } from '../model/TransactionRespon';
import {TransferRespon} from '../model/TransferRespon';
import { SupplyChainSM } from '../search-model/SupplyChainSM';
import {MetaData} from '../model/MetaData';

export interface SupplyChainService extends GenericSearchService<SupplyChain, SupplyChainSM> {
  getSupplyChain(supplyChainSM: SupplyChainSM): Observable<SupplyChain>;

  burnAsset(transactionId: string, outputIndex: number): Observable<any>;
  transferAsset(transactionId: string, outputIndex: number, orgId: string, metaData: MetaData): Observable<any>;
  appendMetaData(transactionId: string, outputIndex: number, metaData: MetaData): Observable<any>;
  divideAsset(transactionId: string, outputIndex: number, divideContent: any): Observable<any>;

  viewHistory(currentTransId: string): Observable<any>;
  createNewAsset(newProduct: CreateProduct): Observable<TransactionRespon>;
  getDataAutoSearch(): Observable<any>;
  getSearchTransactionId(transactionId: string): Observable<any>;
  getTransfer(name, limit):  Observable<TransferRespon>;
  getAllOrganization(): Observable<Orgnization>;
  getLocationProductsByOrgId(OrdId: string, startDate: string, endDate: string): Observable<any>;
  getSearchTxIdByItemIdInList(itemId: string): Observable<any>;
  importCreateAsset(assetsList: any): Observable<any>;
}
