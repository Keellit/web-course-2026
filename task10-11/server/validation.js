const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function isDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function validateCategory(body) {
  if (!isObject(body)) return { error: 'Ожидается объект с данными категории.' };
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name || name.length > 60) return { error: 'Название категории: от 1 до 60 символов.' };
  if (!['income', 'expense'].includes(body.type)) return { error: 'Тип категории должен быть income или expense.' };
  return { value: { name, type: body.type } };
}

function validateTransaction(body, db) {
  if (!isObject(body)) return { error: 'Ожидается объект с данными операции.' };
  if (typeof body.amount !== 'number' || !Number.isFinite(body.amount) || body.amount <= 0) {
    return { error: 'Сумма должна быть положительным числом.' };
  }
  if (!Number.isSafeInteger(body.category_id) || body.category_id <= 0) {
    return { error: 'Укажите корректный идентификатор категории.' };
  }
  const category = db.prepare('SELECT type FROM categories WHERE id = ?').get(body.category_id);
  if (!category) return { error: 'Указанная категория не существует.' };
  if (body.type !== undefined && body.type !== category.type) {
    return { error: 'Тип операции не соответствует типу категории.' };
  }
  if (!isDate(body.date)) return { error: 'Дата должна существовать и иметь формат ГГГГ-ММ-ДД.' };
  if (body.comment !== undefined && body.comment !== null && typeof body.comment !== 'string') {
    return { error: 'Комментарий должен быть строкой.' };
  }
  const comment = body.comment ?? '';
  if (comment.length > 200) return { error: 'Комментарий не должен превышать 200 символов.' };
  return { value: { amount: body.amount, category_id: body.category_id, date: body.date, comment: comment.trim() } };
}

function validateFilters(query) {
  const filters = {};
  if (query.category_id !== undefined && query.category_id !== '') {
    const id = Number(query.category_id);
    if (!Number.isSafeInteger(id) || id <= 0) return { error: 'Некорректный фильтр по категории.' };
    filters.category_id = id;
  }
  if (query.type !== undefined && query.type !== '') {
    if (!['income', 'expense'].includes(query.type)) return { error: 'Некорректный фильтр по типу.' };
    filters.type = query.type;
  }
  for (const field of ['from', 'to']) {
    if (query[field] !== undefined && query[field] !== '') {
      if (!isDate(query[field])) return { error: `Некорректная дата фильтра ${field}.` };
      filters[field] = query[field];
    }
  }
  if (filters.from && filters.to && filters.from > filters.to) {
    return { error: 'Начальная дата не может быть позже конечной.' };
  }
  return { value: filters };
}

function parseId(value) {
  const id = Number(value);
  return /^\d+$/.test(value) && Number.isSafeInteger(id) && id > 0 ? id : null;
}

module.exports = { validateCategory, validateTransaction, validateFilters, parseId };
