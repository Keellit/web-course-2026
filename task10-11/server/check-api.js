const assert = require('node:assert/strict');

const BASE_URL = 'http://localhost:3001';

async function check(method, path, body, expectedStatus) {
  const response = await fetch(BASE_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await response.json();
  assert.equal(response.status, expectedStatus, `${method} ${path}: ${JSON.stringify(data)}`);
  console.log(`${method} ${path} → ${response.status}`);
  return data;
}

async function main() {
  const categories = await check('GET', '/categories', undefined, 200);
  assert.ok(Array.isArray(categories) && categories.length >= 2);

  const category = await check('POST', '/categories', {
    name: `Тест ${Date.now()}`, type: 'expense'
  }, 201);
  assert.ok(category.id);

  const transaction = await check('POST', '/transactions', {
    amount: 10.5, category_id: category.id, date: '2026-11-21', comment: 'API test'
  }, 201);
  assert.equal(transaction.type, 'expense');

  const filtered = await check('GET',
    `/transactions?category_id=${category.id}&type=expense&from=2026-11-01&to=2026-11-30`,
    undefined, 200);
  assert.ok(filtered.some((item) => item.id === transaction.id));
  assert.ok(filtered.every((item) => item.category_id === category.id && item.type === 'expense'));

  const updated = await check('PUT', `/transactions/${transaction.id}`, {
    amount: 25, category_id: category.id, date: '2026-11-22', comment: 'Изменено'
  }, 200);
  assert.equal(updated.amount, 25);

  await check('DELETE', `/transactions/${transaction.id}`, undefined, 200);
  await check('DELETE', `/transactions/${transaction.id}`, undefined, 404);
  await check('POST', '/transactions', {
    amount: -1, category_id: category.id, date: '2026-11-21'
  }, 400);
  await check('GET', '/transactions?from=2026-11-31', undefined, 400);
  console.log('УСПЕШНО: все шесть маршрутов и проверки 400/404 прошли.');
}

main().catch((error) => {
  console.error('Тест API не пройден:', error.message);
  process.exitCode = 1;
});
