import {Identity} from '../../org-bigchaindb-backend/model/Identity';
import {AssetInfoData} from './AssetInfoData';
import {MetaDataInfo} from './MetaDataInfo';

export class CreateTransactionData {
  constructor() {
  }

  public currentIdentity: Identity;
  public amount: number;
  public assetData: AssetInfoData;
  public metaData: MetaDataInfo;
}

