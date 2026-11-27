import { useCallback, useEffect, useMemo, useState } from 'react';
import TodoForm from './components/TodoForm.jsx';
import Filters from './components/Filters.jsx';
import Stats from './components/Stats.jsx';
import TodoList from './components/TodoList.jsx';
import ImportTodos from './components/ImportTodos.jsx';
import { createTodo, deleteTodo, getStats, selectTodos, toggleTodo } from './utils/todos.js';
import { loadInitialState, saveTodos } from './utils/storage.js';
import { mergeTodos } from './utils/api.js';

export default function App() {
  const [initial] = useState(loadInitialState);
  const [todos, setTodos] = useState(initial.todos);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [storageError, setStorageError] = useState(initial.error);

  // Восстановление — при первом рендере, сохранение — при изменении массива.
  useEffect(() => {
    if (initial.error && todos === initial.todos) return;
    try {
      saveTodos(todos);
      setStorageError('');
    } catch {
      setStorageError('Не удалось сохранить задачи в браузере.');
    }
  }, [todos, initial]);

  const handleAdd = useCallback((text, completed) => {
    const todo = createTodo(text, completed);
    setTodos((previous) => [todo, ...previous]);
  }, []);

  const handleToggle = useCallback((id) => {
    setTodos((previous) => toggleTodo(previous, id));
  }, []);

  const handleDelete = useCallback((id) => {
    setTodos((previous) => deleteTodo(previous, id));
  }, []);

  const handleImport = useCallback((imported) => {
    setTodos((previous) => mergeTodos(previous, imported));
  }, []);

  const visibleTodos = useMemo(() => selectTodos(todos, filter, sort), [todos, filter, sort]);
  const stats = useMemo(() => getStats(todos), [todos]);

  return (
    <main className="app">
      <header className="page-header">
        <p className="eyebrow">Лабораторная работа 8–9 / React</p>
        <h1>Список задач</h1>
        <p className="muted">Добавляйте задачи, отслеживайте выполнение и управляйте списком.</p>
      </header>
      <Stats {...stats} />
      <section className="panel" aria-label="Добавление задачи">
        <TodoForm onAdd={handleAdd} />
      </section>
      {storageError && <p className="error" role="alert">{storageError}</p>}
      <section className="panel" aria-labelledby="list-title">
        <h2 id="list-title">Мои задачи</h2>
        <Filters filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort} />
        <TodoList todos={visibleTodos} onToggle={handleToggle} onDelete={handleDelete} />
      </section>
      <ImportTodos onImport={handleImport} />
    </main>
  );
}
