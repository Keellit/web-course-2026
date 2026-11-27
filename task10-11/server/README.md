# Сервер Saldo: Express + SQLite

Требуется Node.js 20+. Откройте терминал в `task10-11/server` и выполните:

```bash
npm install
npm start
```

Сервер слушает `http://localhost:3001`. При первом запуске `db.js` создаёт `database.sqlite` и импортирует демонстрационные данные из `seed.json`.

После запуска сервера в другом терминале проверьте все маршруты:

```bash
npm run check
```

Для журнала запросов, который можно приложить при сдаче лабораторной:

```bash
node check-api.js > api-test-log.txt 2>&1
```

Проверка делает GET/POST `/categories`, GET/POST `/transactions`, PUT/DELETE `/transactions/:id` и проверяет ответы 400/404. Приложите созданный `api-test-log.txt` в репозиторий вместе с работой. В `server/.gitignore` исключены `node_modules` и файлы базы SQLite; `api-test-log.txt` не исключён.

Операции передаются с полями `amount` (число больше 0), `category_id` (существующий ID), `date` (`ГГГГ-ММ-ДД`), `comment` (строка до 200 символов). Тип `income`/`expense` определяется через категорию. При ошибке валидации — 400, несуществующем ID — 404, непредвиденной ошибке — 500 с JSON-полем `error`.
