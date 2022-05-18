import {SearchModel} from '../../common/model/SearchModel';

export interface SupplyChainSM extends SearchModel {
  transactionId?: string;
  spentStatus?: boolean;
  assetId?: string;
  productLine?: string;
  amount?: string;
  timeStamp?: string;
  productDescription?: string;
  providerName?: string;
}
