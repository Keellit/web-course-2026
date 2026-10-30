// Модель: состояние и правила игры (без Canvas и DOM).
export const SIZE = 20;

const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

export function spawnApple(snake) {
  const free = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!snake.some(part => part.x === x && part.y === y)) free.push({ x, y });
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? null;
}

export function createGame() {
  const snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
  return {
    snake, apple: spawnApple(snake), score: 0,
    direction: directions.ArrowRight,
    nextDirection: directions.ArrowRight,
    turnQueued: false, gameOver: false, win: false
  };
}

export function setDirection(game, key) {
  const next = directions[key];
  if (!next || game.gameOver || game.turnQueued) return;
  const { x, y } = game.direction;
  if ((next.x === x && next.y === y) || (next.x === -x && next.y === -y)) return;
  game.nextDirection = next;
  game.turnQueued = true;
}

export function checkCollision(head, body) {
  return head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE ||
    body.some(part => part.x === head.x && part.y === head.y);
}

export function moveSnake(game) {
  game.direction = game.nextDirection;
  game.turnQueued = false;
  const head = game.snake[0];
  const next = { x: head.x + game.direction.x, y: head.y + game.direction.y };
  const eat = next.x === game.apple.x && next.y === game.apple.y;
  const body = eat ? game.snake : game.snake.slice(0, -1);

  if (checkCollision(next, body)) {
    game.gameOver = true;
    return;
  }

  game.snake.unshift(next);
  if (eat) {
    game.score++;
    game.apple = spawnApple(game.snake);
    if (!game.apple) { game.gameOver = true; game.win = true; }
  } else {
    game.snake.pop();
  }
}

export function update(game) {
  if (!game.gameOver) moveSnake(game);
}
