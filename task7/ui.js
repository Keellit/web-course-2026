import { state, TOTAL_POSTS, getVisiblePosts } from './store.js';

const list = document.querySelector('#posts');
const loading = document.querySelector('#loading');
const error = document.querySelector('#error');
const empty = document.querySelector('#empty');
const end = document.querySelector('#end');
const loadControl = document.querySelector('#load-control');
const loadButton = document.querySelector('#load-button');

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

function createCard(post) {
  const card = element('article', 'post-card');
  const header = element('div', 'card-header');
  const number = element('span', 'post-number', `POST / ${String(post.id).padStart(3, '0')}`);
  const author = element('span', 'post-author', `АВТОР ${String(post.userId).padStart(2, '0')}`);
  const title = element('h3', 'post-title', post.title);
  const body = element('p', 'post-body', post.body);
  const footer = element('div', 'card-footer');

  header.append(number, author);
  footer.append(element('span', '', 'JSONPLACEHOLDER'), element('span', 'card-arrow', '↗'));
  card.append(header, title, body, footer);
  return card;
}

export function render() {
  const visible = getVisiblePosts();
  list.replaceChildren(...visible.map(createCard));

  document.querySelector('#result-count').textContent = `ПУБЛИКАЦИИ / ${visible.length}`;
  document.querySelector('#loaded-count').textContent = `ЗАГРУЖЕНО ${state.posts.length} ИЗ ${TOTAL_POSTS}`;

  loading.hidden = !state.loading;
  error.hidden = !state.error;
  empty.hidden = state.loading || !state.posts.length || visible.length > 0;
  end.hidden = !state.finished;
  loadControl.hidden = state.finished || state.error;
  loadButton.disabled = state.loading;
}
