import { memo, useState } from 'react';
import { MAX_TEXT_LENGTH, validateText } from '../utils/todos.js';

function TodoForm({ onAdd }) {
  // Текст и тип новой задачи не нужны остальным компонентам.
  const [text, setText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const message = validateText(text);
    setError(message);
    if (message) return;
    onAdd(text, completed);
    setText('');
    setCompleted(false);
  }

  function handleTextChange(event) {
    setText(event.target.value);
    if (error) setError('');
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <h2>Новая задача</h2>
      <div className="form-fields">
        <label className="text-field">
          Название
          <input value={text} onChange={handleTextChange} maxLength={MAX_TEXT_LENGTH}
            placeholder="Что нужно сделать?" aria-invalid={Boolean(error)}
            aria-describedby={error ? 'form-error' : undefined} />
        </label>
        <label>
          Статус
          <select value={completed ? 'completed' : 'active'}
            onChange={(event) => setCompleted(event.target.value === 'completed')}>
            <option value="active">Невыполненная</option>
            <option value="completed">Выполненная</option>
          </select>
        </label>
        <button className="primary" type="submit">Добавить</button>
      </div>
      {error && <p id="form-error" className="error" role="alert">{error}</p>}
    </form>
  );
}

export default memo(TodoForm);
