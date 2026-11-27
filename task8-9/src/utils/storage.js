export const STORAGE_KEY = 'task8-9.todos.v1';

export function isValidTodo(todo) {
  return todo !== null && typeof todo === 'object' &&
    typeof todo.id === 'string' && todo.id.length > 0 &&
    typeof todo.text === 'string' && todo.text.trim().length > 0 &&
    typeof todo.completed === 'boolean' &&
    Number.isFinite(todo.createdAt) && Math.abs(todo.createdAt) <= 8.64e15;
}

export function readTodos(storage = globalThis.localStorage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isValidTodo) ||
      new Set(parsed.map((todo) => todo.id)).size !== parsed.length) {
    throw new Error('Некорректный формат сохранённых задач.');
  }
  return parsed;
}

export function saveTodos(todos, storage = globalThis.localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function loadInitialState() {
  try {
    return { todos: readTodos(), error: '' };
  } catch {
    return { todos: [], error: 'Не удалось прочитать сохранённые задачи.' };
  }
}
