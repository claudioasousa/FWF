
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

// --- CONFIGURAÇÃO DO SUPABASE ---
// Para usar o banco de dados real, substitua as strings abaixo:
const supabaseUrl = 'https://SUA_URL_AQUI.supabase.co'; 
const supabaseKey = 'SUA_CHAVE_ANON_AQUI';
// --------------------------------

// Verifica se as strings acima foram alteradas de fato
const isDefault = supabaseUrl.includes('SUA_URL_AQUI') || !supabaseUrl.startsWith('https://');

export const isConfigured = !isDefault;

// Só cria o cliente real se estiver configurado, evitando ERR_NAME_NOT_RESOLVED
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co', 
  isConfigured ? supabaseKey : 'placeholder'
);
