import { memo } from 'react';
import TodoItem from './TodoItem.jsx';

function TodoList({ todos, onToggle, onDelete }) {
  if (!todos.length) return <p className="empty">Нет задач для отображения.</p>;

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default memo(TodoList);
