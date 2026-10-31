import { getPosts } from './api.js';
import { renderPosts, showStatus } from './ui.js';

const LIMIT = 10;
const TOTAL = 100;
const posts = [];
const search = document.querySelector('#search');
const retry = document.querySelector('#retry');
let query = '';
let loading = false;
let finished = false;
let failed = false;
let timer;

function nearBottom() {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
}

async function loadMore() {
  if (loading || finished || failed) return;
  loading = true;
  showStatus('Загрузка…');

  try {
    const batch = await getPosts(posts.length, LIMIT);
    posts.push(...batch);
    finished = batch.length < LIMIT || posts.length >= TOTAL;
    renderPosts(posts, query);
    showStatus(finished ? 'Больше постов нет' : '');
  } catch (error) {
    failed = true;
    showStatus(`${error.message}. Проверьте подключение и повторите попытку.`, true);
  } finally {
    loading = false;
    if (!query && !failed && !finished && nearBottom()) loadMore();
  }
}

window.addEventListener('scroll', () => {
  if (nearBottom()) loadMore();
}, { passive: true });

search.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    query = search.value.trim().toLowerCase();
    renderPosts(posts, query);
    if (!query && nearBottom()) loadMore();
  }, 300);
});

retry.addEventListener('click', () => {
  failed = false;
  loadMore();
});

loadMore();
