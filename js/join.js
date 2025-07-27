import { supabase } from './supabaseClient.js';

async function cargarPartidos() {
  const lista = document.getElementById('partidos-list');
  const countSpan = document.getElementById('partidos-count');
  if (!lista) return;

  lista.innerHTML = '';
  if (countSpan) countSpan.textContent = '';

  const { data, error } = await supabase.from('partidos').select('*');

  if (error) {
    lista.innerHTML = '<div class="partido-card">Error al cargar partidos</div>';
    return;
  }

  if (!data || data.length === 0) {
    lista.innerHTML = '<div class="partido-card">No hay partidos disponibles</div>';
    if (countSpan) countSpan.textContent = '0 partidos totales';
    return;
  }

  if (countSpan) countSpan.textContent = `${data.length} partido${data.length === 1 ? '' : 's'} total${data.length === 1 ? '' : 'es'}`;

  data.forEach((partido, idx) => {
    // Estado de ejemplo: alternar color por fecha/hora o por idx
    let statusColor = 'green';
    if (idx % 3 === 1) statusColor = 'orange';
    if (idx % 3 === 2) statusColor = 'blue';

    const card = document.createElement('div');
    card.className = `partido-card ${statusColor}`;
    card.innerHTML = `
      <div class="partido-header">
        <span class="partido-status ${statusColor}"></span>
        <span class="partido-title">${partido.deporte}</span>
        <div class="partido-actions">
          <button title="Unirse" onclick="unirse('${partido.id}')">➕</button>
        </div>
      </div>
      <div class="partido-info">
        <span>📅 <b>${formatearFecha(partido.fecha)}</b> &nbsp; 🕒 <b>${partido.hora}</b>
        </span>
      </div>
      <div class="partido-meta">
        <span class="icon">📍</span> ${partido.ubicacion}
        <!-- Aquí podrías agregar más info, como número de jugadores -->
      </div>
    `;
    lista.appendChild(card);
  });
}

function formatearFecha(fechaStr) {
  // Espera formato YYYY-MM-DD
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const d = new Date(fechaStr);
  if (isNaN(d)) return fechaStr;
  return `${d.toLocaleDateString('es-ES', { weekday: 'short' })}, ${d.getDate()} ${meses[d.getMonth()]}`;
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

document.getElementById('joinPartidoForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const partidoId = document.getElementById('partidoId').value;

  const { error } = await supabase.from('participantes').insert([
    { partido_id: partidoId, usuario_nombre: nombre }
  ]);

  if (error) {
    alert('Error al unirse al partido');
  } else {
    alert('Solicitud enviada');
    window.location.href = 'index.html';
  }
});

cargarPartidos();