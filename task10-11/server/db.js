const path = require('node:path');
const Database = require('better-sqlite3');
const seed = require('./seed.json');

const db = new Database(path.join(__dirname, 'database.sqlite'));
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense'))
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    category_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    comment TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`);

// Демоданные из исходной лабораторной добавляются только в пустую базу.
if (db.prepare('SELECT COUNT(*) AS count FROM categories').get().count === 0) {
  db.transaction(() => {
    const addCategory = db.prepare('INSERT INTO categories (name, type) VALUES (?, ?)');
    const addTransaction = db.prepare(`
      INSERT INTO transactions (amount, category_id, date, comment)
      VALUES (?, ?, ?, ?)
    `);
    const ids = new Map();

    seed.categories.forEach((category) => {
      const result = addCategory.run(category.name, category.type);
      ids.set(category.id, Number(result.lastInsertRowid));
    });

    seed.transactions.forEach((item) => {
      addTransaction.run(item.amount, ids.get(item.categoryId), item.date, item.comment);
    });
  })();
}

module.exports = db;
