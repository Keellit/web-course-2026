import { memo } from 'react';

function Stats({ total, active, completed }) {
  return (
    <dl className="stats" aria-label="Статистика задач" aria-live="polite">
      <div><dt>Всего</dt><dd>{total}</dd></div>
      <div><dt>Осталось</dt><dd>{active}</dd></div>
      <div><dt>Выполнено</dt><dd>{completed}</dd></div>
    </dl>
  );
}

export default memo(Stats);
