import {DynamicField} from './DynamicField';
import {TransactionData} from './TransactionData';

export class AssetMetaData {
    constructor() {
    }

    providerId: string;
    contents: DynamicField;
    noteAction: string;
    sources: TransactionData[];
}
