// Контроллер: клавиатура, кнопка и игровой цикл.
import { createGame, setDirection, update } from './game.js';
import { draw } from './render.js';

const ctx = document.querySelector('#field').getContext('2d');
const score = document.querySelector('#score');
const status = document.querySelector('#status');
const INTERVAL = 150;
let game, lastMove, frameId;

function render() {
  draw(ctx, game);
  score.textContent = game.score;
  status.textContent = game.gameOver
    ? `${game.win ? 'Победа!' : 'Игра окончена.'} Итоговый счёт: ${game.score}`
    : 'Управление: стрелки клавиатуры';
}

function loop(time) {
  if (time - lastMove >= INTERVAL) {
    update(game);
    lastMove = time;
    render();
  }
  if (!game.gameOver) frameId = requestAnimationFrame(loop);
}

function restart() {
  cancelAnimationFrame(frameId);
  game = createGame();
  lastMove = performance.now();
  render();
  frameId = requestAnimationFrame(loop);
}

document.addEventListener('keydown', event => {
  if (!event.key.startsWith('Arrow')) return;
  event.preventDefault();
  setDirection(game, event.key);
});
document.querySelector('#restart').addEventListener('click', restart);
restart();
