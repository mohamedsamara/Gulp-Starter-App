/*
 *
 * Todo thunks
 *
 */

// Do this in every file where you use `fetch`
import fetch from 'cross-fetch';
import { push, goBack } from 'connected-react-router';

import {
  fetchTodosRequest,
  fetchTodosSuccess,
  fetchTodosFailure
} from './actions';

export function fetchTodos() {
  return function (dispatch, getState) {
    dispatch(checkTodos());

    return fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'GET'
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        return response.json();
      })
      .then(data => {
        dispatch(fetchTodosSuccess(data));
        dispatch(fetchTodosRequest(false));
      })
      .catch(error => {
        let errorData = {};
        errorData.isError = true;
        errorData.errorMessage = 'Failed To Fetch Todos';

        dispatch(fetchTodosFailure(errorData));
      });
  };
}

// Check Todos
export function checkTodos() {
  return function (dispatch, getState) {
    if (getState().todo.todos.length == 0) {
      dispatch(fetchTodosRequest(true));
    }
  };
}
