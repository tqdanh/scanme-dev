import { AssetData } from './AssetData';
import { MetaData } from './MetaData';

export class SupplyChain {
  transactionId: string;
  spentStatus: boolean;
  outputIndex: number;
  metaData: MetaData;
  currentPublicKey: string;
  creatorPublicKey: string;
  assetId: string;
  assetData: AssetData;
  amount: string;
}
