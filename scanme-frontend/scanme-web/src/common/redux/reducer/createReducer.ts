import {combineReducers} from 'redux';
import {reducer} from 'redux-form';
import {ReduxState} from '../ReduxState';

export const createReducer = asyncReducers =>
  combineReducers<ReduxState<any, any>>({
    form: reducer,
    ...asyncReducers
});
