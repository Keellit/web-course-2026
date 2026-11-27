import test from 'node:test';
import assert from 'node:assert/strict';
import { createTodo, validateText, selectTodos, toggleTodo, deleteTodo, getStats } from '../src/utils/todos.js';
import { readTodos, saveTodos, STORAGE_KEY } from '../src/utils/storage.js';
import { mergeTodos, fetchExampleTodos } from '../src/utils/api.js';

const tasks = [
  { id: '1', text: 'Яблоко', completed: false, createdAt: 100 },
  { id: '2', text: 'Банан', completed: true, createdAt: 300 },
  { id: '3', text: 'Абрикос', completed: false, createdAt: 200 },
];
const ids = (list) => list.map((todo) => todo.id);

test('валидация пустого текста и длины', () => {
  assert.ok(validateText('  '));
  assert.ok(validateText('а'.repeat(201)));
  assert.equal(validateText('  Задача  '), '');
});
test('создание задачи с выбранным статусом и уникальным id', () => {
  const first = createTodo('  Тест  ', true);
  assert.equal(first.text, 'Тест');
  assert.equal(first.completed, true);
  assert.notEqual(first.id, createTodo('Тест').id);
});
test('фильтры и сортировка по дате', () => {
  assert.deepEqual(ids(selectTodos(tasks, 'active', 'newest')), ['3', '1']);
  assert.deepEqual(ids(selectTodos(tasks, 'completed', 'oldest')), ['2']);
  assert.deepEqual(ids(selectTodos(tasks, 'all', 'oldest')), ['1', '3', '2']);
});
test('сортировка по алфавиту не мутирует исходный массив', () => {
  assert.deepEqual(ids(selectTodos(tasks, 'all', 'alphabet')), ['3', '2', '1']);
  assert.deepEqual(ids(tasks), ['1', '2', '3']);
});
test('переключение сохраняет ссылки неизменившихся элементов', () => {
  const result = toggleTodo(tasks, '2');
  assert.equal(result[1].completed, false);
  assert.equal(tasks[1].completed, true);
  assert.equal(result[0], tasks[0]);
  assert.equal(result[2], tasks[2]);
  assert.notEqual(result[1], tasks[1]);
});
test('удаление и счётчики', () => {
  assert.deepEqual(getStats(tasks), { total: 3, active: 2, completed: 1 });
  assert.deepEqual(ids(deleteTodo(tasks, '2')), ['1', '3']);
  assert.deepEqual(getStats([]), { total: 0, active: 0, completed: 0 });
});
test('сохранение и восстановление из хранилища', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.deepEqual(readTodos(storage), []);
  saveTodos(tasks, storage);
  assert.deepEqual(readTodos(storage), tasks);
  values.set(STORAGE_KEY, 'broken');
  assert.throws(() => readTodos(storage));
});
test('импорт без повторных идентификаторов', () => {
  const newTodo = { ...tasks[0], id: 'api-1' };
  const result = mergeTodos(tasks, [tasks[0], newTodo, newTodo]);
  assert.deepEqual(ids(result), ['api-1', '1', '2', '3']);
  assert.equal(mergeTodos(result, [newTodo]), result);
});
test('API: преобразование ответа и обработка HTTP-ошибки', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch', async () => ({
    ok: true, json: async () => [{ id: 8, title: 'Example', completed: false }],
  }));
  const result = await fetchExampleTodos();
  assert.equal(result[0].id, 'api-8');
  assert.equal(result[0].text, 'Example');
  mock.mock.mockImplementation(async () => ({ ok: false, status: 503 }));
  await assert.rejects(fetchExampleTodos(), /503/);
});
