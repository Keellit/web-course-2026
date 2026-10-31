const URL = 'https://jsonplaceholder.typicode.com/posts';

export async function getPosts(start, limit) {
  try {
    const response = await fetch(`${URL}?_start=${start}&_limit=${limit}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось получить посты: ${error.message}`);
  }
}
