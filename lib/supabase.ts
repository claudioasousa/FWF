
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

// --- CONFIGURAÇÃO DO SUPABASE ---
// URL e Chave atualizadas conforme fornecido.
const supabaseUrl = 'https://fpuetcwkvzejxpooguac.supabase.co'; 
const supabaseKey = 'sb_publishable_k1IJsKmejk4jmqpNReSPfg_fJ1I6qsS'; 
// --------------------------------

// O sistema entrará em modo "Online" apenas se a URL e a Chave forem preenchidas corretamente.
const isPlaceholder = 
  !supabaseUrl || 
  supabaseUrl.includes('SUA_URL_AQUI') || 
  supabaseKey.includes('SUA_CHAVE_ANON_AQUI');

export const isConfigured = !isPlaceholder;

/**
 * Cliente Supabase:
 * Se as credenciais forem válidas, conecta à rede.
 * Caso contrário, aponta para um endereço inofensivo para evitar erros de DNS no console.
 */
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'http://127.0.0.1', 
  isConfigured ? supabaseKey : 'not-configured'
);
