const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos';

export async function fetchExampleTodos(signal) {
  const response = await fetch(TODOS_URL, { signal });
  if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('Некорректный ответ API.');
  const now = Date.now();
  return data.filter((item) => item && Number.isInteger(item.id) &&
    typeof item.title === 'string' && item.title.trim() && typeof item.completed === 'boolean')
    .slice(0, 20)
    .map((item) => ({
      id: `api-${item.id}`,
      text: item.title.trim(),
      completed: item.completed,
      createdAt: now,
    }));
}

export function mergeTodos(todos, imported) {
  const ids = new Set(todos.map((todo) => todo.id));
  const additions = imported.filter((todo) => {
    if (ids.has(todo.id)) return false;
    ids.add(todo.id);
    return true;
  });
  return additions.length ? [...additions, ...todos] : todos;
}
