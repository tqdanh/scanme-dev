import { CurrentIdentity } from './CurrentIdentity';

export interface Divide {
  currentTxId: string;
  outputIndexOfCurrentChain: number;
  currentIdentity: CurrentIdentity;
  divideContent: any;
}
