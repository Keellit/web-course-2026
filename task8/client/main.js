import * as api from './api.js';
import * as ui from './ui.js';

const STORAGE_KEY = 'saldo.filters';
let transactions = [];
let categories = [];
let editingId = null;
let busy = false;

function today() {
  const date = new Date();
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')].join('-');
}

function savedFilters() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
    return Object.fromEntries(['type', 'category_id', 'from', 'to'].map((field) => [
      field, typeof stored[field] === 'string' ? stored[field] : ''
    ]));
  } catch {
    return {};
  }
}

function cancelEditing() {
  editingId = null;
  ui.resetForm(categories, today());
}

async function refreshTransactions() {
  transactions = await api.getTransactions(ui.readFilters());
  ui.renderSummary(transactions);
  ui.renderTransactions(transactions);
}

async function loadData() {
  if (busy) return;
  busy = true;
  ui.setBusy(true);
  ui.hideNotice();
  try {
    categories = await api.getCategories();
    ui.renderFilterCategories(categories, ui.readFilters().category_id);
    cancelEditing();
    await refreshTransactions();
  } catch (error) {
    ui.showNotice(`Не удалось загрузить данные. ${error.message}`, 'error', true);
  } finally {
    busy = false;
    ui.setBusy(false);
  }
}

function validateForm(item) {
  if (!Number.isFinite(item.amount) || item.amount <= 0) return 'Введите сумму больше нуля.';
  const category = categories.find((entry) => entry.id === item.category_id);
  if (!category || category.type !== item.type) return 'Выберите категорию нужного типа.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) return 'Укажите дату операции.';
  if (item.comment.length > 200) return 'Комментарий слишком длинный.';
  return '';
}

async function saveTransaction(event) {
  event.preventDefault();
  if (busy) return;
  const item = ui.readForm();
  const error = validateForm(item);
  if (error) return ui.showNotice(error, 'error');

  const wasEditing = editingId !== null;
  busy = true;
  ui.setBusy(true);
  try {
    if (wasEditing) await api.updateTransaction(editingId, item);
    else await api.addTransaction(item);
    await refreshTransactions();
    cancelEditing();
    ui.showNotice(wasEditing ? 'Изменения сохранены.' : 'Операция добавлена.');
  } catch (error) {
    ui.showNotice(`Не удалось сохранить операцию. ${error.message}`, 'error');
  } finally {
    busy = false;
    ui.setBusy(false);
  }
}

async function handleTransactionClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button || busy) return;
  const item = transactions.find((entry) => String(entry.id) === button.dataset.id);
  if (!item) return;
  if (button.dataset.action === 'edit') {
    editingId = item.id;
    ui.fillForm(item, categories);
    document.querySelector('#form-panel').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (button.dataset.action !== 'delete' || !confirm('Удалить эту операцию?')) return;

  busy = true;
  ui.setBusy(true);
  try {
    await api.deleteTransaction(item.id);
    if (editingId === item.id) cancelEditing();
    await refreshTransactions();
    ui.showNotice('Операция удалена.');
  } catch (error) {
    ui.showNotice(`Не удалось удалить операцию. ${error.message}`, 'error');
  } finally {
    busy = false;
    ui.setBusy(false);
  }
}

async function applyFilters(event) {
  if (event) event.preventDefault();
  if (busy) return;
  const filters = ui.readFilters();
  if (filters.from && filters.to && filters.from > filters.to) {
    return ui.showNotice('Начальная дата не может быть позже конечной.', 'error');
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  busy = true;
  ui.setBusy(true);
  try {
    await refreshTransactions();
    ui.hideNotice();
  } catch (error) {
    ui.showNotice(`Не удалось применить фильтры. ${error.message}`, 'error', true);
  } finally {
    busy = false;
    ui.setBusy(false);
  }
}

function resetFilters(event) {
  event.preventDefault();
  ui.fillFilters({});
  applyFilters();
}

async function saveCategory(event) {
  event.preventDefault();
  if (busy) return;
  const category = ui.readCategoryForm();
  if (!category.name || category.name.length > 60) {
    return ui.showNotice('Название категории: от 1 до 60 символов.', 'error');
  }
  if (!['income', 'expense'].includes(category.type)) {
    return ui.showNotice('Выберите тип категории.', 'error');
  }

  busy = true;
  ui.setBusy(true);
  try {
    const oldCategoryId = document.querySelector('#category').value;
    const created = await api.addCategory(category);
    categories = await api.getCategories();
    const selectedType = document.querySelector('input[name="type"]:checked').value;
    ui.renderCategories(categories, selectedType,
      created.type === selectedType ? created.id : oldCategoryId);
    ui.renderFilterCategories(categories, ui.readFilters().category_id);
    ui.resetCategoryForm();
    ui.showNotice(`Категория «${created.name}» добавлена.`);
  } catch (error) {
    ui.showNotice(`Не удалось создать категорию. ${error.message}`, 'error');
  } finally {
    busy = false;
    ui.setBusy(false);
  }
}

document.querySelector('#transaction-form').addEventListener('submit', saveTransaction);
document.querySelector('#transaction-list').addEventListener('click', handleTransactionClick);
document.querySelector('#cancel-button').addEventListener('click', cancelEditing);
document.querySelector('#retry-button').addEventListener('click', loadData);
document.querySelector('#close-notice').addEventListener('click', ui.hideNotice);
document.querySelector('#category-form').addEventListener('submit', saveCategory);
document.querySelector('#filters-form').addEventListener('change', applyFilters);
document.querySelector('#filters-form').addEventListener('submit', applyFilters);
document.querySelector('#filter-reset-button').addEventListener('click', resetFilters);
document.querySelectorAll('input[name="type"]').forEach((input) => {
  input.addEventListener('change', () => ui.renderCategories(categories, input.value));
});

ui.resetForm(categories, today());
ui.fillFilters(savedFilters());
loadData();
