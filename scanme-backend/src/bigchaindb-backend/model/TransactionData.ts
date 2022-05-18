import {AssetMetaData} from './AssetMetaData';

export class TransactionData extends AssetMetaData {
    constructor() {
        super();
    }

    transactionId: string;
    outputIndex: number;
    amount: number;
    metaData: AssetMetaData;
    assetId: string;
}
