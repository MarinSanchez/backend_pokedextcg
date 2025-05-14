// importar.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// ✅ Cambia esta URI por la tuya de MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://clausanchez10g:Aldrobandi@cluster0.a184tjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0y';

const filePath = path.join(__dirname, 'pokemon.json');

// Esquema y modelo
const pokemonSchema = new mongoose.Schema({
  numero: Number,
  nombre: String,
  obtenido: { type: Number, default: 0 }
});
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

// Conectar a MongoDB y cargar datos
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Conectado a MongoDB Atlas');

  // Leer JSON
  const rawData = fs.readFileSync(filePath);
  const data = JSON.parse(rawData);

  // Limpiar colección (opcional)
  await Pokemon.deleteMany({});

  // Insertar todos los Pokémon
  await Pokemon.insertMany(data);

  console.log(`✅ Se importaron ${data.length} Pokémon correctamente`);
  mongoose.disconnect();
})
.catch(err => {
  console.error('❌ Error al importar:', err);
});
