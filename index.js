// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Reemplaza con tu URI de conexión de MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://clausanchez10g:Aldrobandi@cluster0.a184tjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0y';

app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Esquema y Modelo de Pokémon
const pokemonSchema = new mongoose.Schema({
  numero: Number,
  nombre: String,
  obtenido: { type: Number, default: 0 }
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

// ✅ Obtener todos los Pokémon
app.get('/pokemon', async (req, res) => {
  try {
    const data = await Pokemon.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los Pokémon' });
  }
});

// ✅ Obtener Pokémon por nombre
app.get('/pokemon/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre.toLowerCase();
    const pokemon = await Pokemon.findOne({ nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } });
    if (!pokemon) return res.status(404).json({ message: 'Pokémon no encontrado' });
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar el Pokémon' });
  }
});

// ✅ Cambiar estado de obtenido usando número y nuevoEstado
app.put('/pokemon/:numero/estado/:nuevoEstado', async (req, res) => {
  const numero = parseInt(req.params.numero);
  const nuevoEstado = parseInt(req.params.nuevoEstado);

  if (isNaN(numero) || (nuevoEstado !== 0 && nuevoEstado !== 1)) {
    return res.status(400).json({ message: 'Parámetros inválidos. Uso: /pokemon/1/estado/1 ó /pokemon/1/estado/0' });
  }

  try {
    const pokemon = await Pokemon.findOneAndUpdate(
      { numero },
      { obtenido: nuevoEstado },
      { new: true }
    );

    if (!pokemon) return res.status(404).json({ message: 'Pokémon no encontrado' });

    res.json({ message: `Estado actualizado a ${nuevoEstado}`, pokemon });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
});

// ✅ Agregar un nuevo Pokémon
app.post('/pokemon', async (req, res) => {
  const { numero, nombre, obtenido } = req.body;

  try {
    const existe = await Pokemon.findOne({ nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } });
    if (existe) return res.status(400).json({ message: 'Este Pokémon ya existe' });

    const newPokemon = new Pokemon({ numero, nombre, obtenido: obtenido || 0 });
    await newPokemon.save();

    res.json({ message: 'Pokémon agregado', newPokemon });
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar el Pokémon' });
  }
});

// 🔍 Obtener todos los Pokémon no obtenidos

app.get('/faltantes', async (req, res) => {
  try {
    const noObtenidos = await Pokemon.find({ obtenido: 0 });
    res.json(noObtenidos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los Pokémon no obtenidos' });
  }
});

// ✅ Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
