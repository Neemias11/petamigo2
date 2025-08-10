import { createClient } from '@supabase/supabase-js';

// Substitua 'SUA_URL_DO_PROJETO' pela URL do seu projeto Supabase
const supabaseUrl = 'https://bpcusshibcfxbzawgtfb.supabase.co'; 

// Substitua 'SUA_CHAVE_ANON_PUBLIC' pela sua chave anon public do Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwY3Vzc2hpYmNmeGJ6YXdndGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDk3NjYsImV4cCI6MjA2NDk4NTc2Nn0.9HjFDyBIkKT3ZQFqYS-AJ90iRsS4LH2H_k8QoUstw10'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);