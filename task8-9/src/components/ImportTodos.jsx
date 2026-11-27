import { memo, useEffect, useRef, useState } from 'react';
import { fetchExampleTodos } from '../utils/api.js';

function ImportTodos({ onImport }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const request = useRef(null);

  useEffect(() => () => request.current?.abort(), []);

  async function handleImport() {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError(false);
    setMessage('');
    try {
      const todos = await fetchExampleTodos(controller.signal);
      if (controller.signal.aborted) return;
      onImport(todos);
      setMessage('Импорт завершён. Уже имеющиеся задачи не дублируются.');
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(true);
      setMessage(`Не удалось загрузить задачи: ${err.message}`);
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  return (
    <div className="import-section">
      <button type="button" onClick={handleImport} disabled={loading}>
        {loading ? 'Загрузка…' : 'Загрузить примеры из API'}
      </button>
      {message && <p className={error ? 'error' : 'muted'} role={error ? 'alert' : 'status'}>{message}</p>}
    </div>
  );
}

export default memo(ImportTodos);
