import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, nextRound, beginInput, enterColor } from './model.mjs';

test('стартовое состояние: игра не запущена', () => {
  assert.deepEqual(createGame(), { sequence: [], cursor: 0, phase: 'idle' });
});
test('первый раунд содержит один цвет из 0–3', () => {
  const game = nextRound(createGame(), () => 0.99);
  assert.deepEqual(game.sequence, [3]);
  assert.equal(game.phase, 'showing');
});
test('последовательность растёт ровно на один цвет и сохраняет префикс', () => {
  let game = createGame();
  for (let i = 0; i < 12; i += 1) {
    const prefix = game.sequence;
    game = nextRound(game, () => 0.51);
    assert.deepEqual(game.sequence.slice(0, -1), prefix);
    assert.equal(game.sequence.length, i + 1);
  }
});
test('во время показа нажатия игнорируются', () => {
  const game = nextRound(createGame(), () => 0);
  const result = enterColor(game, 2);
  assert.equal(result.outcome, 'ignored');
  assert.equal(result.game, game);
});
test('показ заканчивается переходом в фазу ввода', () => {
  const game = nextRound(createGame(), () => 0);
  assert.equal(beginInput(game).phase, 'input');
});
test('верная последовательность сначала ожидает следующий ввод, затем завершает раунд', () => {
  const game = beginInput(nextRound(nextRound(createGame(), () => 0), () => 0.6));
  const first = enterColor(game, 0);
  assert.equal(first.outcome, 'continue');
  assert.equal(first.game.cursor, 1);
  const second = enterColor(first.game, 2);
  assert.equal(second.outcome, 'complete');
  assert.equal(second.game.phase, 'transition');
  assert.equal(second.game.cursor, 0);
});
test('ошибка мгновенно завершает игру; последующие нажатия игнорируются', () => {
  const game = beginInput(nextRound(createGame(), () => 0));
  const lost = enterColor(game, 3);
  assert.equal(lost.outcome, 'lost');
  assert.equal(lost.game.phase, 'lost');
  assert.equal(enterColor(lost.game, 0).outcome, 'ignored');
});
test('новая игра не наследует предыдущую последовательность', () => {
  const old = nextRound(nextRound(createGame(), () => 0), () => 0.6);
  const fresh = nextRound(createGame(), () => 0.99);
  assert.deepEqual(old.sequence, [0, 2]);
  assert.deepEqual(fresh.sequence, [3]);
});
