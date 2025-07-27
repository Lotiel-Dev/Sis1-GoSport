import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://<TU_URL>.supabase.co';
const SUPABASE_KEY = '<TU_API_KEY>'; // Usa tu anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


-- Paso 6: js/create.js
import { supabase } from './supabaseClient.js';

document.getElementById('crearPartidoForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const deporte = document.getElementById('deporte').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const ubicacion = document.getElementById('ubicacion').value;

  const { data, error } = await supabase.from('partidos').insert([
    { creador_id: crypto.randomUUID(), deporte, fecha, hora, ubicacion }
  ]);

  if (error) {
    alert('Error al crear partido');
    console.error(error);
  } else {
    alert('Partido creado con éxito');
    window.location.href = 'index.html';
  }
});