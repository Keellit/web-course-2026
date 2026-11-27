const API_URL = 'http://localhost:3001';

async function request(path, options = {}) {
  try {
    const response = await fetch(API_URL + path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Ошибка сервера (${response.status}).`);
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Нет связи с сервером. Запустите Express на порту 3001.');
    }
    throw error;
  }
}

export const getCategories = () => request('/categories');
export const addCategory = (category) => request('/categories', {
  method: 'POST', body: JSON.stringify(category)
});

export function getTransactions(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) params.set(key, value);
  });
  const query = params.toString();
  return request(`/transactions${query ? `?${query}` : ''}`);
}

export const addTransaction = (item) => request('/transactions', {
  method: 'POST', body: JSON.stringify(item)
});
export const updateTransaction = (id, item) => request(`/transactions/${id}`, {
  method: 'PUT', body: JSON.stringify(item)
});
export const deleteTransaction = (id) => request(`/transactions/${id}`, {
  method: 'DELETE'
});
