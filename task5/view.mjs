/** Слой представления Simon: отрисовывает состояние и управляет подсветкой. */
const start = document.querySelector('#start');
const board = document.querySelector('#board');
const pads = [...board.querySelectorAll('[data-pad]')];
const level = document.querySelector('#level');
const progress = document.querySelector('#progress');
const status = document.querySelector('#status');
const sound = document.querySelector('#sound');

const descriptions = {
  idle: 'Нажмите «Старт», чтобы начать.',
  showing: 'Смотрите и запоминайте последовательность.',
  input: 'Ваш ход: повторите подсвеченные цвета в том же порядке.',
  transition: 'Верно! Переходим на следующий уровень…',
};

export function render(game) {
  const currentLevel = game.sequence.length;
  level.textContent = String(currentLevel);
  progress.textContent = `${game.phase === 'transition' ? currentLevel : Math.max(0, currentLevel - 1)} пройдено`;
  status.textContent = game.phase === 'lost'
    ? `Игра окончена. Вы дошли до уровня ${currentLevel}. Пройдено раундов: ${currentLevel - 1}.`
    : descriptions[game.phase];
  status.classList.toggle('status--lost', game.phase === 'lost');
  pads.forEach((pad) => { pad.disabled = game.phase !== 'input'; });
  start.textContent = game.phase === 'idle' ? 'Старт' : 'Начать заново';
}

export function lightPad(index, active) {
  pads[index].classList.toggle('is-lit', active);
}

export function clearLights() {
  pads.forEach((pad) => pad.classList.remove('is-lit', 'is-tapped'));
}

export function showTap(index) {
  const pad = pads[index];
  pad.classList.remove('is-tapped');
  void pad.offsetWidth; // повторно запускает CSS-анимацию быстрых нажатий
  pad.classList.add('is-tapped');
}

pads.forEach((pad) => {
  pad.addEventListener('animationend', () => pad.classList.remove('is-tapped'));
});

export const elements = { start, board, sound };
