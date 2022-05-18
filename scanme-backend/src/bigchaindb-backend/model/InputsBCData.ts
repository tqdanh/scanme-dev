import {BigchainTransactionId} from './BigchainTransactionId';

export class InputsBCData {
    constructor() {
    }
    public fulfills: BigchainTransactionId;
    public owners_before: Array<string>;
    public fulfillment: string;
}
