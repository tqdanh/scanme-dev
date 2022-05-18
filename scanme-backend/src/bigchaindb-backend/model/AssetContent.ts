import {TransactionData} from './TransactionData';

export class AssetContent {
    constructor() {
    }

    providerId: string;
    providerName: string;
    productLine: string;
    productDescription: string;
    quantity: number;
    unit: number;
    sources?: TransactionData[];
}
