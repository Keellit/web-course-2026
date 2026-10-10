import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, generateSecret, validateGuess, countBullsAndCows, makeGuess } from './model.mjs';

test('генерация: 4 различные цифры, первая не ноль', () => {
  for (let i = 0; i < 1000; i += 1) {
    const secret = generateSecret();
    assert.match(secret, /^[1-9]\d{3}$/);
    assert.equal(new Set(secret).size, 4);
  }
});
test('все четыре быка', () => assert.deepEqual(countBullsAndCows('1234', '1234'), { bulls: 4, cows: 0 }));
test('четыре коровы', () => assert.deepEqual(countBullsAndCows('1234', '4321'), { bulls: 0, cows: 4 }));
test('бык и две коровы', () => assert.deepEqual(countBullsAndCows('1234', '1425'), { bulls: 1, cows: 2 }));
test('совпадений нет', () => assert.deepEqual(countBullsAndCows('1234', '5678'), { bulls: 0, cows: 0 }));
test('ноль внутри числа учитывается', () => assert.deepEqual(countBullsAndCows('1023', '0139'), { bulls: 0, cows: 3 }));
test('ноль в начале попытки допустим', () => assert.equal(validateGuess('0123'), ''));
test('пустые, нецифровые, повторяющиеся и длинные вводы отклоняются', () => {
  for (const guess of ['', '123', '12345', '12a4', '1123', ' 1234', '-123']) {
    assert.ok(validateGuess(guess), `Не прошла проверка: ${guess}`);
  }
});
test('ошибка не расходует попытку; победа блокирует следующие ходы', () => {
  const original = { ...createGame(() => 0), secret: '1234' };
  assert.equal(makeGuess(original, '1111').game.history.length, 0);
  const afterFirst = makeGuess(original, '5678').game;
  assert.equal(afterFirst.history.length, 1);
  const won = makeGuess(afterFirst, '1234').game;
  assert.equal(won.finished, true);
  assert.equal(won.history.length, 2);
  assert.equal(makeGuess(won, '1234').game.history.length, 2);
  assert.equal(original.history.length, 0);
});
