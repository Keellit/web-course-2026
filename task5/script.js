/** Контроллер: события, очереди setTimeout и переключение фаз. */
import { createGame, nextRound, beginInput, enterColor } from './model.mjs';
import { elements, render, lightPad, clearLights, showTap } from './view.mjs';
import { playTone } from './sound.mjs';

const FLASH_MS = 480;
const GAP_MS = 230;
const NEXT_ROUND_MS = 750;
const timers = new Set();
let generation = 0;
let game = createGame();

function schedule(callback, delay) {
  const id = setTimeout(() => {
    timers.delete(id);
    callback();
  }, delay);
  timers.add(id);
}

function cancelPending() {
  generation += 1;
  timers.forEach(clearTimeout);
  timers.clear();
  clearLights();
}

function playSequence(position, ticket) {
  if (ticket !== generation) return;
  if (position === game.sequence.length) {
    game = beginInput(game);
    render(game);
    return;
  }

  const color = game.sequence[position];
  lightPad(color, true);
  playTone(color, elements.sound.checked);
  schedule(() => {
    if (ticket !== generation) return;
    lightPad(color, false);
    schedule(() => playSequence(position + 1, ticket), GAP_MS);
  }, FLASH_MS);
}

function startRound() {
  game = nextRound(game);
  render(game);
  playSequence(0, generation);
}

function startGame() {
  cancelPending();
  game = createGame();
  startRound();
}

elements.start.addEventListener('click', startGame);

elements.board.addEventListener('click', (event) => {
  const pad = event.target.closest('[data-pad]');
  if (!pad || game.phase !== 'input') return;
  const color = Number(pad.dataset.pad);
  const result = enterColor(game, color);
  game = result.game;
  showTap(color);
  playTone(color, elements.sound.checked);
  render(game);

  if (result.outcome === 'lost') cancelPending();
  if (result.outcome === 'complete') {
    const ticket = generation;
    schedule(() => { if (ticket === generation) startRound(); }, NEXT_ROUND_MS);
  }
});

render(game);
