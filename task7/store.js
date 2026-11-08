export const PAGE_SIZE = 10;
export const TOTAL_POSTS = 100;

export const state = {
  posts: [],
  query: '',
  loading: false,
  finished: false,
  error: false
};

export function addPosts(posts) {
  state.posts.push(...posts);
  state.finished = posts.length < PAGE_SIZE || state.posts.length >= TOTAL_POSTS;
}

export function getVisiblePosts() {
  const query = state.query.toLowerCase();
  return state.posts.filter(post => post.title.toLowerCase().includes(query));
}
