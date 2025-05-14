// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('pokemon.db');

// Crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pokemon (
      numero INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL UNIQUE,
      obtenido INTEGER DEFAULT 0
    )
  `);
});

module.exports = db;
