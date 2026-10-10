/** Слой представления: создаёт DOM по данным, ничего не знает о генерации числа. */
const form = document.querySelector('#guess-form');
const input = document.querySelector('#guess');
const newGameButton = document.querySelector('#new-game');
const checkButton = document.querySelector('#check');
const history = document.querySelector('#history');
const attempts = document.querySelector('#attempts');
const message = document.querySelector('#message');
const error = document.querySelector('#error');
const empty = document.querySelector('#empty');

function word(count, one, few, many) {
  const rem100 = count % 100;
  const rem10 = count % 10;
  if (rem100 >= 11 && rem100 <= 14) return many;
  if (rem10 === 1) return one;
  if (rem10 >= 2 && rem10 <= 4) return few;
  return many;
}

export function render(game, validationError = '') {
  attempts.textContent = String(game.history.length);
  error.textContent = validationError;
  message.textContent = game.finished
    ? `Победа! Угадано за ${game.history.length} ${word(game.history.length, 'попытку', 'попытки', 'попыток')}.`
    : 'Число загадано. У вас неограниченное количество попыток.';
  message.classList.toggle('message--won', game.finished);
  input.disabled = game.finished;
  checkButton.disabled = game.finished;
  empty.hidden = game.history.length > 0;

  const rows = game.history.map(({ guess, bulls, cows }, index) => {
    const row = document.createElement('li');
    row.className = 'history-item';
    const number = document.createElement('span');
    number.className = 'history-number';
    number.textContent = `#${index + 1}`;
    const result = document.createElement('span');
    result.className = 'history-result';
    result.textContent = `${guess} → ${bulls} ${word(bulls, 'бык', 'быка', 'быков')}, ${cows} ${word(cows, 'корова', 'коровы', 'коров')}`;
    row.append(number, result);
    return row;
  });
  history.replaceChildren(...rows);
}

export function clearInput() {
  input.value = '';
  input.focus();
}

export const elements = { form, input, newGameButton };
