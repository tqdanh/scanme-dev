import {InputsBCData} from './InputsBCData';
import {OutputsBCData} from './OutputsBCData';

export class BigChainTransaction {
    constructor() {
    }

    public id: string;
    public version: string;
    public inputs: Array<InputsBCData>;
    public outputs: Array<OutputsBCData>;
    public operation: string;
    public asset: object;
    public metadata: object;
}
