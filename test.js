const fetch = require('node-fetch'); // Instalar si no lo tienes

// Cambia esto para probar otras funciones
const testAgregarPokemon = async () => {
  try {
    const res = await fetch('http://localhost:3000/pokemon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        numero: 26,  // Cambia el número para evitar conflicto
        nombre: 'pikachuV',
        obtenido: 0
      })
    });

    const data = await res.json();
    console.log('✅ Respuesta:', data);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  fetch('http://localhost:3000/pokemon/pikachu')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error('Error:', err));
};

testAgregarPokemon();

