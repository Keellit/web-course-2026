import * as api from './api.js';
import * as ui from './ui.js';

let transactions = [];
let categories = [];
let editingId = null;
let busy = false;

function today() {
  const date = new Date();
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')].join('-');
}

function refresh() {
  ui.renderSummary(transactions);
  ui.renderTransactions(transactions, categories);
}

function cancelEditing() {
  editingId = null;
  ui.resetForm(categories, today());
}

async function loadData() {
  if (busy) return;
  busy = true;
  ui.hideNotice();
  ui.setBusy(true);
  try {
    [categories, transactions] = await Promise.all([
      api.getCategories(), api.getTransactions()
    ]);
    refresh();
    cancelEditing();
  } catch (error) {
    ui.showNotice(`Не удалось загрузить данные. ${error.message}`, 'error', true);
  } finally {
    busy = false;
    ui.setBusy(false);
  }
}

async function saveTransaction(event) {
  event.preventDefault();
  if (busy) return;

  const item = ui.readForm();
  if (!Number.isFinite(item.amount) || item.amount <= 0 || !item.categoryId || !item.date) {
    ui.showNotice('Укажите положительную сумму, категорию и дату.', 'error');
    return;
  }

  busy = true;
  ui.setBusy(true);
  try {
    if (editingId === null) {
      const created = await api.addTransaction(item);
      transactions.push(created);
    } else {
      const updated = await api.updateTransaction(editingId, item);
      transactions = transactions.map((old) =>
        String(old.id) === String(editingId) ? updated : old
      );
    }
    refresh();
    ui.showNotice(editingId === null ? 'Операция добавлена.' : 'Изменения сохранены.');
    cancelEditing();
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

  if (!confirm('Удалить эту операцию?')) return;
  busy = true;
  try {
    await api.deleteTransaction(item.id);
    transactions = transactions.filter((entry) => String(entry.id) !== String(item.id));
    if (String(editingId) === String(item.id)) cancelEditing();
    refresh();
    ui.showNotice('Операция удалена.');
  } catch (error) {
    ui.showNotice(`Не удалось удалить операцию. ${error.message}`, 'error');
  } finally {
    busy = false;
  }
}

document.querySelector('#transaction-form').addEventListener('submit', saveTransaction);
document.querySelector('#transaction-list').addEventListener('click', handleTransactionClick);
document.querySelector('#cancel-button').addEventListener('click', cancelEditing);
document.querySelector('#retry-button').addEventListener('click', loadData);
document.querySelector('#close-notice').addEventListener('click', ui.hideNotice);
document.querySelectorAll('input[name="type"]').forEach((input) => {
  input.addEventListener('change', () => ui.renderCategories(categories, input.value));
});

ui.resetForm(categories, today());
loadData();
