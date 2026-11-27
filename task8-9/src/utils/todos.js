export const MAX_TEXT_LENGTH = 200;

// Для нового фильтра или сортировки достаточно добавить запись в этот объект.
export const FILTERS = {
  all: { label: 'Все', test: () => true },
  active: { label: 'Активные', test: (todo) => !todo.completed },
  completed: { label: 'Завершённые', test: (todo) => todo.completed },
};

const collator = new Intl.Collator(['ru', 'en'], { sensitivity: 'base', numeric: true });

export const SORTS = {
  newest: { label: 'Сначала новые', compare: (a, b) => b.createdAt - a.createdAt },
  oldest: { label: 'Сначала старые', compare: (a, b) => a.createdAt - b.createdAt },
  alphabet: { label: 'По алфавиту', compare: (a, b) => collator.compare(a.text, b.text) },
};

export function validateText(text) {
  if (typeof text !== 'string' || !text.trim()) return 'Введите текст задачи.';
  if (text.trim().length > MAX_TEXT_LENGTH) return `Не более ${MAX_TEXT_LENGTH} символов.`;
  return '';
}

export function createTodo(text, completed = false) {
  return {
    id: globalThis.crypto.randomUUID?.() ?? `todo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text: text.trim(),
    completed,
    createdAt: Date.now(),
  };
}

export function toggleTodo(todos, id) {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
}

export function deleteTodo(todos, id) {
  return todos.filter((todo) => todo.id !== id);
}

export function selectTodos(todos, filter, sort) {
  const predicate = FILTERS[filter].test;
  const compare = SORTS[sort].compare;
  const filtered = todos.filter(predicate);
  return [...filtered].sort(compare);
}

export function getStats(todos) {
  const completed = todos.filter((todo) => todo.completed).length;
  return { total: todos.length, active: todos.length - completed, completed };
}
