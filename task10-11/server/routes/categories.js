const express = require('express');
const db = require('../db');
const { validateCategory } = require('../validation');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, name, type FROM categories ORDER BY id').all();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось получить категории.' });
  }
});

router.post('/', (req, res) => {
  try {
    const { value, error } = validateCategory(req.body);
    if (error) return res.status(400).json({ error });

    const result = db.prepare('INSERT INTO categories (name, type) VALUES (?, ?)')
      .run(value.name, value.type);
    const created = db.prepare('SELECT id, name, type FROM categories WHERE id = ?')
      .get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось создать категорию.' });
  }
});

module.exports = router;
