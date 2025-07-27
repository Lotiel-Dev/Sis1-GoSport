import { supabase } from './supabaseClient.js';

document.getElementById('crearPartidoForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const deporte = document.getElementById('deporte').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const ubicacion = document.getElementById('ubicacion').value;

  const { data, error } = await supabase
    .from('partidos')
    .insert([
      { 
        creador_id: crypto.randomUUID(), // Esto puedes mantenerlo como UUID o cambiarlo
        deporte, 
        fecha, 
        hora, 
        ubicacion 
      }
    ])
    .select();

  if (error) {
    console.error('Error:', error);
    alert('Error al crear partido');
  } else {
    console.log('Partido creado con ID:', data[0].id); // Ahora será un número secuencial
    alert(`Partido creado con ID: ${data[0].id}`);
    window.location.href = 'index.html';
  }
});


