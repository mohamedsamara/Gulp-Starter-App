/*
 *
 * Todo
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions.js';
import TodoList from '../../components/TodoList';

export class Todo extends React.Component {
  componentDidMount() {
    this.props.fetchTodos();
  }

  render() {
    const { todos, isFetching, error } = this.props;

    return (
      <div className='todo'>
        {isFetching && <span className='loading-indicator'>Loading Todos</span>}
        {error.isError ? (
          <span className='error'>{error.errorMessage}</span>
        ) : (
          <TodoList todos={todos} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    todos: state.todo.todos,
    error: state.todo.error,
    isFetching: state.todo.isFetching
  };
};

export default connect(
  mapStateToProps,
  actions
)(Todo);
