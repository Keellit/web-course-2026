// Представление: только рисование состояния на Canvas.
import { SIZE } from './game.js';

export function draw(ctx, game) {
  const cell = ctx.canvas.width / SIZE;
  ctx.fillStyle = '#182438';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.strokeStyle = '#25334a';
  for (let i = 1; i < SIZE; i++) {
    const p = i * cell;
    ctx.beginPath();
    ctx.moveTo(p, 0); ctx.lineTo(p, ctx.canvas.height);
    ctx.moveTo(0, p); ctx.lineTo(ctx.canvas.width, p);
    ctx.stroke();
  }

  if (game.apple) {
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc((game.apple.x + 0.5) * cell, (game.apple.y + 0.5) * cell, cell * 0.38, 0, Math.PI * 2);
    ctx.fill();
  }

  game.snake.forEach((part, i) => {
    ctx.fillStyle = i === 0 ? '#a7f3d0' : '#34d399';
    ctx.fillRect(part.x * cell + 2, part.y * cell + 2, cell - 4, cell - 4);
  });
}
