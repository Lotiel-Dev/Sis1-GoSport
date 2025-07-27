import { supabase } from './supabaseClient.js';

async function cargarPartidos() {
  const lista = document.getElementById('partidos-list');
  const { data, error } = await supabase.from('partidos').select('*');

  if (error) {
    lista.innerHTML = '<li>Error al cargar partidos</li>';
    return;
  }

  if (data.length === 0) {
    lista.innerHTML = '<li>No hay partidos disponibles</li>';
    return;
  }

  data.forEach(partido => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${partido.deporte}</strong><br>
      Fecha: ${partido.fecha} - Hora: ${partido.hora}<br>
      Lugar: ${partido.ubicacion}<br>
      <button onclick="unirse('${partido.id}')">Unirse</button>
    `;
    lista.appendChild(li);
  });
}

window.unirse = async (partidoId) => {
  const nombre = prompt('Ingresa tu nombre para unirte al partido');
  if (!nombre) return;

  const { error } = await supabase.from('participantes').insert([
    { partido_id: partidoId, usuario_nombre: nombre }
  ]);

  if (error) {
    alert('Error al unirse al partido');
  } else {
    alert('Solicitud enviada');
  }
};

cargarPartidos();