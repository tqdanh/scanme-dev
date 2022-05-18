import {Identity} from './Identity';
import {TransactionId} from './TransactionId';

export class TransactionIdRequest extends TransactionId {
    constructor() {
        super();
    }
    providerId: string;
    identity: Identity;
}
