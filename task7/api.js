const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export async function fetchPosts(start, limit) {
  try {
    const params = new URLSearchParams({ _start: start, _limit: limit });
    const response = await fetch(`${API_URL}?${params}`);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const posts = await response.json();
    if (!Array.isArray(posts)) throw new Error('Неверный формат ответа');

    return posts;
  } catch (error) {
    throw new Error(`Ошибка запроса: ${error.message}`);
  }
}
