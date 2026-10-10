/** Слой модели: правила игры и состояние, без обращения к DOM. */
export function generateSecret(random = Math.random) {
  const digits = Array.from({ length: 10 }, (_, digit) => String(digit));
  const first = digits.splice(1 + Math.floor(random() * 9), 1)[0];
  const result = [first];

  while (result.length < 4) {
    result.push(digits.splice(Math.floor(random() * digits.length), 1)[0]);
  }
  return result.join('');
}

export function validateGuess(guess) {
  if (!/^\d{4}$/.test(guess)) return 'Введите ровно четыре цифры от 0 до 9.';
  if (new Set(guess).size !== 4) return 'Все четыре цифры должны быть разными.';
  return '';
}

export function countBullsAndCows(secret, guess) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < 4; i += 1) {
    if (secret[i] === guess[i]) bulls += 1;
    else if (secret.includes(guess[i])) cows += 1;
  }
  return { bulls, cows };
}

export function createGame(random = Math.random) {
  return { secret: generateSecret(random), history: [], finished: false };
}

export function makeGuess(game, guess) {
  if (game.finished) return { game, error: 'Игра окончена. Начните новую.' };
  const error = validateGuess(guess);
  if (error) return { game, error };

  const result = { guess, ...countBullsAndCows(game.secret, guess) };
  return {
    game: {
      ...game,
      history: [...game.history, result],
      finished: result.bulls === 4,
    },
    error: '',
  };
}
