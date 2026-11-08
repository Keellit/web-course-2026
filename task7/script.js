import { fetchPosts } from './api.js';
import { state, PAGE_SIZE, addPosts } from './store.js';
import { render } from './ui.js';

async function loadMore() {
  if (state.loading || state.finished) return;

  state.loading = true;
  state.error = false;
  render();

  try {
    const posts = await fetchPosts(state.posts.length, PAGE_SIZE);
    addPosts(posts);
  } catch (error) {
    state.error = true;
  } finally {
    state.loading = false;
    render();
  }
}

let previousScrollY = window.scrollY;
function onScroll() {
  const scrollingDown = window.scrollY > previousScrollY;
  previousScrollY = window.scrollY;
  if (!scrollingDown || state.error) return;

  const remaining = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
  if (remaining < 200) loadMore();
}

let searchTimer;
document.querySelector('#search').addEventListener('input', event => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.query = event.target.value.trim();
    render();
  }, 300);
});

document.querySelector('#retry-button').addEventListener('click', loadMore);
document.querySelector('#load-button').addEventListener('click', loadMore);
window.addEventListener('scroll', onScroll, { passive: true });

loadMore();
