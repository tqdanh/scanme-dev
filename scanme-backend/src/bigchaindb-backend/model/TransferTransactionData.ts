import {Identity} from '../../org-bigchaindb-backend/model/Identity';
import {MetaDataInfo} from './MetaDataInfo';

export class TransferTransactionData {
    constructor() {
    }

    public currentTxId: string;
    public outputIndexOfCurrentChain: number;
    public organizationId: string;
    public currentIdentity: Identity;
    public metaData?: MetaDataInfo;
    public receiverPublicKey?: string;
}
