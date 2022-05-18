import {Identity} from '../../org-bigchaindb-backend/model/Identity';
import {DivideContent} from './DivideContent';

export class DivideDataOutput {
    constructor() {
    }

    public currentTxId: string;
    public outputIndexOfCurrentChain: number;
    public currentIdentity: Identity;
    public divideContent: DivideContent[];
}
