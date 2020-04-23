/**
 *
 * app.js
 * 
 */

import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import store, { history } from './store';
import Todo from './containers/Todo';

const app = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Todo />
    </ConnectedRouter>
  </Provider>
);

export default app;
