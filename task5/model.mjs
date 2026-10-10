/** Модель Simon: только состояние и правила, без DOM и таймеров. */
export const PADS = ['Зелёный', 'Красный', 'Жёлтый', 'Синий'];

export function createGame() {
  return { sequence: [], cursor: 0, phase: 'idle' };
}

export function nextRound(game, random = Math.random) {
  const color = Math.min(3, Math.floor(random() * PADS.length));
  return {
    sequence: [...game.sequence, color],
    cursor: 0,
    phase: 'showing',
  };
}

export function beginInput(game) {
  return game.phase === 'showing' ? { ...game, phase: 'input' } : game;
}

export function enterColor(game, color) {
  if (game.phase !== 'input') return { game, outcome: 'ignored' };
  if (game.sequence[game.cursor] !== color) {
    return { game: { ...game, phase: 'lost' }, outcome: 'lost' };
  }
  if (game.cursor === game.sequence.length - 1) {
    return { game: { ...game, cursor: 0, phase: 'transition' }, outcome: 'complete' };
  }
  return { game: { ...game, cursor: game.cursor + 1 }, outcome: 'continue' };
}
