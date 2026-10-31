const list = document.querySelector('#posts');
const counter = document.querySelector('#counter');
const empty = document.querySelector('#empty');
const status = document.querySelector('#status');
const retry = document.querySelector('#retry');

export function renderPosts(posts, query) {
  const visible = posts.filter(post => post.title.toLowerCase().includes(query));
  const fragment = document.createDocumentFragment();

  visible.forEach(post => {
    const card = document.createElement('article');
    card.className = 'post';
    const title = document.createElement('h2');
    const body = document.createElement('p');
    const author = document.createElement('small');
    title.textContent = post.title;
    body.textContent = post.body;
    author.textContent = `Автор #${post.userId}`;
    card.append(title, body, author);
    fragment.append(card);
  });

  list.replaceChildren(fragment);
  counter.textContent = `Показано: ${visible.length} из ${posts.length} загруженных`;
  empty.hidden = visible.length > 0 || posts.length === 0;
}

export function showStatus(message, withRetry = false) {
  status.textContent = message;
  retry.hidden = !withRetry;
}
