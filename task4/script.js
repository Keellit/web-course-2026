/** Слой контроллера: связывает действия пользователя, модель и представление. */
import { createGame, makeGuess } from './model.mjs';
import { elements, render, clearInput } from './view.mjs';

let game = createGame();
render(game);

elements.form.addEventListener('submit', (event) => {
  event.preventDefault();
  const { game: updated, error } = makeGuess(game, elements.input.value);
  game = updated;
  render(game, error);
  if (!error) clearInput();
});

elements.newGameButton.addEventListener('click', () => {
  game = createGame();
  render(game);
  clearInput();
});
