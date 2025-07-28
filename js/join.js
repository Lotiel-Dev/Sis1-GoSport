import { supabase } from './supabaseClient.js';

async function cargarPartidos() {
  const lista = document.getElementById('partidos-list');
  const countSpan = document.getElementById('partidos-count');
  if (!lista) return;

  lista.innerHTML = '';
  if (countSpan) countSpan.textContent = '';

  // Traer partidos y participantes en paralelo
  const [{ data: partidos, error: errorPartidos }, { data: participantes, error: errorParticipantes }] = await Promise.all([
    supabase.from('partidos').select('*'),
    supabase.from('participantes').select('*')
  ]);

  if (errorPartidos || errorParticipantes) {
    lista.innerHTML = '<div class="partido-card">Error al cargar partidos</div>';
    return;
  }

  if (!partidos || partidos.length === 0) {
    lista.innerHTML = '<div class="partido-card">No hay partidos disponibles</div>';
    if (countSpan) countSpan.textContent = '0 partidos totales';
    return;
  }

  if (countSpan) countSpan.textContent = `${partidos.length} partido${partidos.length === 1 ? '' : 's'} total${partidos.length === 1 ? '' : 'es'}`;

  partidos.forEach((partido, idx) => {
    // Estado de ejemplo: alternar color por fecha/hora o por idx
    let statusColor = 'green';
    if (idx % 3 === 1) statusColor = 'orange';
    if (idx % 3 === 2) statusColor = 'blue';

    // Filtrar participantes de este partido
    const part = participantes.filter(p => p.partido_id === partido.id);
    const enEspera = part.filter(p => p.estado === 'pendiente').length;
    const aceptados = part.filter(p => p.estado === 'aceptado').length;
    const rechazados = part.filter(p => p.estado === 'rechazado').length;
    const total = part.length;

    const card = document.createElement('div');
    card.className = `partido-card ${statusColor}`;
    card.innerHTML = `
      <div class="partido-header">
        <span class="partido-status ${statusColor}"></span>
        <span class="partido-title">${partido.deporte}</span>
        <div class="partido-actions">
          <button title="Editar" onclick="editarPartido(${partido.id})">✏️</button>
          <button title="Eliminar" onclick="eliminarPartido(${partido.id})">🗑️</button>
          <button title="Unirse" onclick="unirse('${partido.id}')">➕</button>
        </div>
      </div>
      <div class="partido-info">
        <span>📅 <b>${formatearFecha(partido.fecha)}</b> &nbsp; 🕒 <b>${partido.hora}</b>
        </span>
      </div>
      <div class="partido-meta">
        <span class="icon">📍</span> ${partido.ubicacion}
        <span class="icon" title="Jugadores aceptados">👥 <b>${aceptados}</b></span>
        <span class="icon" title="En espera">⏳ <b>${enEspera}</b></span>
        <span class="icon" title="Rechazados">❌ <b>${rechazados}</b></span>
        <span class="icon" title="Total">| <b>${total}</b></span>
      </div>
    `;
    lista.appendChild(card);
  });
}
// Eliminar partido
window.eliminarPartido = async (partidoId) => {
  if (!confirm('¿Seguro que deseas eliminar este partido?')) return;
  const { error } = await supabase.from('partidos').delete().eq('id', partidoId);
  if (error) {
    alert('Error al eliminar partido');
  } else {
    cargarPartidos();
  }
};

// Editar partido (solo ejemplo: redirige a create.html con query param)
window.editarPartido = (partidoId) => {
  window.location.href = `create.html?edit=${partidoId}`;
};

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