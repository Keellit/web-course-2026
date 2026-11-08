const form = document.querySelector('#transaction-form');
const list = document.querySelector('#transaction-list');
const notice = document.querySelector('#notice');

function money(amount) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' BYN';
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

export function renderSummary(transactions) {
  const total = (type) => transactions
    .filter((item) => item.type === type)
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const income = total('income');
  const expense = total('expense');
  document.querySelector('#income').textContent = money(income);
  document.querySelector('#expense').textContent = money(expense);
  document.querySelector('#balance').textContent = money(income - expense);
}

export function renderCategories(categories, type, selected = '') {
  const select = form.elements.categoryId;
  select.replaceChildren(new Option('Выберите категорию', ''));
  categories.filter((item) => item.type === type).forEach((item) => {
    select.add(new Option(item.name, item.id));
  });
  select.value = String(selected);
}

function setFormTitle(text) {
  document.querySelector('#form-title').replaceChildren(
    document.createTextNode(text), element('span', 'green-period', '.')
  );
}

function setSubmitText(text) {
  document.querySelector('#submit-button').replaceChildren(
    document.createTextNode(text + ' '), element('span', '', '↗')
  );
}

function createAction(icon, title, action, id) {
  const button = element('button', 'action-button', icon);
  button.type = 'button';
  button.title = title;
  button.setAttribute('aria-label', title);
  button.dataset.action = action;
  button.dataset.id = String(id);
  return button;
}

export function renderTransactions(transactions, categories) {
  const sorted = [...transactions].sort((a, b) =>
    b.date.localeCompare(a.date) || Number(b.id) - Number(a.id)
  );

  const cards = sorted.map((item) => {
    const category = categories.find((c) => String(c.id) === String(item.categoryId));
    const name = category ? category.name : 'Без категории';
    const date = new Date(`${item.date}T12:00:00`).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    const card = element('article', 'transaction');
    const icon = element('span', `transaction-icon ${item.type}`, item.type === 'income' ? '↙' : '↗');
    const info = element('div', 'transaction-info');
    info.append(element('h3', 'transaction-name', name));
    info.append(element('p', 'transaction-comment', item.comment || 'Без комментария'));

    const details = element('div', 'transaction-details');
    details.append(element('strong', `transaction-amount ${item.type}`,
      `${item.type === 'income' ? '+' : '−'}${money(Number(item.amount))}`));
    details.append(element('time', 'transaction-date', date));

    const actions = element('div', 'transaction-actions');
    actions.append(createAction('✎', `Редактировать: ${name}`, 'edit', item.id));
    actions.append(createAction('×', `Удалить: ${name}`, 'delete', item.id));
    card.append(icon, info, details, actions);
    return card;
  });

  list.replaceChildren(...cards);
  document.querySelector('#transaction-count').textContent = `Операций: ${transactions.length}`;
  document.querySelector('#empty').hidden = transactions.length !== 0;
}

export function readForm() {
  const data = new FormData(form);
  return {
    type: data.get('type'),
    amount: Number(data.get('amount')),
    categoryId: Number(data.get('categoryId')),
    date: data.get('date'),
    comment: String(data.get('comment')).trim()
  };
}

export function fillForm(item, categories) {
  form.querySelector(`input[name="type"][value="${item.type}"]`).checked = true;
  renderCategories(categories, item.type, item.categoryId);
  form.elements.amount.value = item.amount;
  form.elements.date.value = item.date;
  form.elements.comment.value = item.comment || '';
  setFormTitle('Редактировать операцию');
  setSubmitText('Сохранить изменения');
  document.querySelector('#cancel-button').hidden = false;
}

export function resetForm(categories, date) {
  form.reset();
  form.elements.date.value = date;
  renderCategories(categories, 'expense');
  setFormTitle('Новая операция');
  setSubmitText('Добавить операцию');
  document.querySelector('#cancel-button').hidden = true;
}

export function setBusy(isBusy) {
  document.querySelector('#submit-button').disabled = isBusy;
  document.querySelector('#loading').hidden = !isBusy;
}

export function showNotice(message, kind = 'success', retry = false) {
  notice.hidden = false;
  notice.className = `notice ${kind}`;
  document.querySelector('#notice-text').textContent = message;
  document.querySelector('#retry-button').hidden = !retry;
}

export function hideNotice() {
  notice.hidden = true;
}
