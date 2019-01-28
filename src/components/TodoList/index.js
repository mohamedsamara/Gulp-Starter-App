/**
 *
 * TodoList
 *
 */

import React from 'react';

const TodoList = props => {
  const { todos } = props;

  const todoNodes = todos.map(todo => (
    <div key={todo.id} className='todo-item'>
      <span>Todo Title</span>
      <p>{todo.title}</p>
      <span>IsCompleted</span>
      <p>{todo.completed ? 'Completed' : 'Not completed'}</p>
    </div>
  ));

  return <div className='todo-list'>{todoNodes}</div>;
};

export default TodoList;
