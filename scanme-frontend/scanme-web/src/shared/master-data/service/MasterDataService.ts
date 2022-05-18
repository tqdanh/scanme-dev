import {Observable} from 'rxjs';
import {ValueText} from '../../../core';

export interface MasterDataService {
  getStatus(): Observable<ValueText[]>;
  getCtrlStatus(): Observable<ValueText[]>;
  getActionStatus(): Observable<ValueText[]>;
  getEntityTypes(): Observable<ValueText[]>;
  getRoleTypes(): Observable<ValueText[]>;
  getUserTypes(): Observable<ValueText[]>;
  getUserActivityLogs(): Observable<ValueText[]>;
  getTitles(): Observable<ValueText[]>;
  getPositions(): Observable<ValueText[]>;
  getGenders(): Observable<ValueText[]>;
  getWebServiceTypes(): Observable<ValueText[]>;
  getDefaultAcounts(): Observable<ValueText[]>;
  getTransactionFeeRules(): Observable<ValueText[]>;
  getPaymentAmount(): Observable<ValueText[]>;
  getPaymentStatus(): Observable<ValueText[]>;
  getPostingType(): Observable<ValueText[]>;
  getFeeStatus(): Observable<ValueText[]>;
}
