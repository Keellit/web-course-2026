import { memo } from 'react';

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'medium', timeStyle: 'short',
});

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <label className="todo-label">
        <input type="checkbox" checked={todo.completed}
          onChange={() => onToggle(todo.id)} />
        <span className="todo-text">{todo.text}</span>
      </label>
      <time dateTime={new Date(todo.createdAt).toISOString()}>
        {dateFormat.format(todo.createdAt)}
      </time>
      <button type="button" className="delete" onClick={() => onDelete(todo.id)}
        aria-label={`Удалить: ${todo.text}`}>Удалить</button>
    </li>
  );
}

// Неизменившиеся задачи сохраняют ссылки на свои объекты и не перерисовываются.
export default memo(TodoItem);
