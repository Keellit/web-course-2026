const express = require('express');
const cors = require('cors');
require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/categories', require('./routes/categories'));
app.use('/transactions', require('./routes/transactions'));

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден.' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'Некорректный JSON в запросе.' });
  }
  console.error(error);
  res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
});

app.listen(3001, () => console.log('Saldo API: http://localhost:3001'));
