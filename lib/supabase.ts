
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

// --- CONFIGURAÇÃO DO SUPABASE ---
// Para conectar ao seu banco real:
// 1. Crie um projeto em https://supabase.com
// 2. Vá em Project Settings -> API e copie os valores abaixo
const supabaseUrl = 'https://SUA_URL_AQUI.supabase.co'; 
const supabaseKey = 'SUA_CHAVE_ANON_AQUI';
// --------------------------------

// Verifica se a URL é o placeholder padrão ou a URL de teste antiga que está falhando
const isInvalid = 
  !supabaseUrl || 
  supabaseUrl.includes('SUA_URL_AQUI') || 
  supabaseUrl.includes('fpuetcwkvzejpooguac') || // Bloqueia o domínio que está gerando erro de DNS
  !supabaseUrl.startsWith('https://');

export const isConfigured = !isInvalid;

/**
 * World-class connection handling: 
 * Se não configurado, apontamos para localhost para evitar que o navegador 
 * tente resolver um domínio externo inexistente (DNS Error).
 */
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'http://127.0.0.1', 
  isConfigured ? supabaseKey : 'not-configured'
);
