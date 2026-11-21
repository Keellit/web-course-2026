const express = require('express');
const db = require('../db');
const { validateTransaction, validateFilters, parseId } = require('../validation');
const router = express.Router();

const selectSql = `
  SELECT t.id, t.amount, t.category_id, t.date, t.comment,
         c.type, c.name AS category_name
  FROM transactions t
  JOIN categories c ON c.id = t.category_id
`;

function findTransaction(id) {
  return db.prepare(`${selectSql} WHERE t.id = ?`).get(id);
}

router.get('/', (req, res) => {
  try {
    const { value, error } = validateFilters(req.query);
    if (error) return res.status(400).json({ error });

    const conditions = [];
    const params = [];
    if (value.category_id) {
      conditions.push('t.category_id = ?');
      params.push(value.category_id);
    }
    if (value.type) {
      conditions.push('c.type = ?');
      params.push(value.type);
    }
    if (value.from) {
      conditions.push('t.date >= ?');
      params.push(value.from);
    }
    if (value.to) {
      conditions.push('t.date <= ?');
      params.push(value.to);
    }
    const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
    const transactions = db.prepare(`${selectSql}${where} ORDER BY t.date DESC, t.id DESC`).all(...params);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось получить операции.' });
  }
});

router.post('/', (req, res) => {
  try {
    const { value, error } = validateTransaction(req.body, db);
    if (error) return res.status(400).json({ error });
    const result = db.prepare(`
      INSERT INTO transactions (amount, category_id, date, comment) VALUES (?, ?, ?, ?)
    `).run(value.amount, value.category_id, value.date, value.comment);
    res.status(201).json(findTransaction(result.lastInsertRowid));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось создать операцию.' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Некорректный ID операции.' });
    if (!findTransaction(id)) return res.status(404).json({ error: 'Операция не найдена.' });
    const { value, error } = validateTransaction(req.body, db);
    if (error) return res.status(400).json({ error });

    db.prepare(`
      UPDATE transactions SET amount = ?, category_id = ?, date = ?, comment = ? WHERE id = ?
    `).run(value.amount, value.category_id, value.date, value.comment, id);
    res.json(findTransaction(id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось обновить операцию.' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Некорректный ID операции.' });
    const result = db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Операция не найдена.' });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось удалить операцию.' });
  }
});

module.exports = router;
