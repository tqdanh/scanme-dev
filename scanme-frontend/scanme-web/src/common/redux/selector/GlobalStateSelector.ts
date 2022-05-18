import {Selector} from 'reselect';
import {GlobalState} from '../GlobalState';

export class GlobalStateSelector<G> {
  protected selectGlobalState: Selector<GlobalState<G>, G> = (state: GlobalState<G>) => state.globalState || {} as G;
}
