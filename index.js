// index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const filePath = path.join(__dirname, 'pokemon.json');

app.use(cors());
app.use(express.json());

// Función para leer el archivo JSON
function readData() {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
}

// Función para escribir en el archivo JSON
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ✅ Ruta: obtener información de un Pokémon por nombre
app.get('/pokemon/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  const data = readData();
  const pokemon = data.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());

  if (!pokemon) return res.status(404).json({ message: 'Pokémon no encontrado' });
  res.json(pokemon);
});

// ✅ Ruta: cambiar el estado de obtenido (1 o 0)
app.put('/pokemon/:nombre/estado', (req, res) => {
  const nombre = req.params.nombre;
  const nuevoEstado = req.body.obtenido;
  const data = readData();
  
  const pokemon = data.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
  if (!pokemon) return res.status(404).json({ message: 'Pokémon no encontrado' });
  
  pokemon.obtenido = nuevoEstado;
  writeData(data);

  res.json({ message: 'Estado actualizado correctamente' });
});

// ✅ Ruta: agregar un nuevo Pokémon (opcional)
app.post('/pokemon', (req, res) => {
  const { numero, nombre, obtenido } = req.body;
  const data = readData();

  // Verifica si ya existe el Pokémon
  const existingPokemon = data.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
  if (existingPokemon) {
    return res.status(400).json({ message: 'Este Pokémon ya existe' });
  }

  // Agrega el nuevo Pokémon
  const newPokemon = { numero, nombre, obtenido: obtenido || 0 };
  data.push(newPokemon);
  writeData(data);

  res.json({ message: 'Pokémon agregado', newPokemon });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
