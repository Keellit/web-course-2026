import { memo } from 'react';
import { FILTERS, SORTS } from '../utils/todos.js';

function Filters({ filter, sort, onFilterChange, onSortChange }) {
  return (
    <div className="filters">
      <div className="filter-buttons" role="group" aria-label="Фильтр задач">
        {Object.entries(FILTERS).map(([value, { label }]) => (
          <button type="button" key={value} aria-pressed={filter === value}
            onClick={() => onFilterChange(value)}>{label}</button>
        ))}
      </div>
      <label className="sort-field">
        Сортировка
        <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
          {Object.entries(SORTS).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default memo(Filters);
