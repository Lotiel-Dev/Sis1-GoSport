import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://haxudbrirwgejlrtqtsp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheHVkYnJpcndnZWpscnRxdHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1Nzg1NzgsImV4cCI6MjA2OTE1NDU3OH0.Tr1ZZugkzGBp2FidyAKyBn7Bb4N5NpuBvvbM7oJQ-lw'; // Usa tu anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);