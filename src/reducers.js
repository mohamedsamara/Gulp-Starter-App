/*
 *
 * reducers.js
 * reducers configuration
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// import reducers
import todoReducer from './containers/Todo/reducer';

const createReducer = history =>
  combineReducers({
    router: connectRouter(history),
    todo: todoReducer
  });

export default createReducer;
