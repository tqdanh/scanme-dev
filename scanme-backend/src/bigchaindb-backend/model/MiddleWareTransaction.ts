import {Output} from './Output';

export class MiddleWareTransaction {
    constructor() {
    }

    public nextTxId: string;
    public outputsOfNextChain: Output[];
}
