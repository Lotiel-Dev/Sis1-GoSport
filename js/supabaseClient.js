import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://<TU_URL>.supabase.co';
const SUPABASE_KEY = '<TU_API_KEY>'; // Usa tu anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);