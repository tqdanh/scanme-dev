import {combineEpics} from 'redux-observable';
import {EpicFormatter} from '../core';


const epicComponents = [

];
export const rootEpic = combineEpics(
  ...EpicFormatter.formatEpicComponents(epicComponents)
);
