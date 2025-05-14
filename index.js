// index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ Ruta: obtener información de un Pokémon por nombre
app.get('/pokemon/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  db.get('SELECT * FROM pokemon WHERE nombre = ?', [nombre], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Pokémon no encontrado' });
    res.json(row);
  });
});

// ✅ Ruta: cambiar el estado de obtenido (1 o 0)
app.put('/pokemon/:nombre/estado', (req, res) => {
  const nombre = req.params.nombre;
  const nuevoEstado = req.body.obtenido;

  db.run(
    'UPDATE pokemon SET obtenido = ? WHERE nombre = ?',
    [nuevoEstado, nombre],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ message: 'Pokémon no encontrado' });
      res.json({ message: 'Estado actualizado correctamente' });
    }
  );
});

// ✅ Ruta: agregar un nuevo Pokémon (opcional)
app.post('/pokemon', (req, res) => {
  const { numero, nombre, obtenido } = req.body;
  db.run(
    'INSERT INTO pokemon (numero, nombre, obtenido) VALUES (?, ?, ?)',
    [numero, nombre, obtenido || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Pokémon agregado', id: this.lastID });
    }
  );
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
