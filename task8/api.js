const API_URL = 'http://localhost:3001';

async function request(path, options = {}) {
  try {
    const response = await fetch(API_URL + path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });

    if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Нет связи с сервером. Проверьте, запущен ли json-server на порту 3001.');
    }
    throw error;
  }
}

export const getCategories = () => request('/categories');
export const getTransactions = () => request('/transactions');

export const addTransaction = (transaction) => request('/transactions', {
  method: 'POST',
  body: JSON.stringify(transaction)
});

export const updateTransaction = (id, transaction) => request(`/transactions/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(transaction)
});

export const deleteTransaction = (id) => request(`/transactions/${id}`, {
  method: 'DELETE'
});
