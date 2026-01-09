
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

// ATENÇÃO: Substitua as informações abaixo pelas credenciais do SEU projeto no Supabase
// Você encontra isso em: Project Settings -> API
const supabaseUrl = 'https://fpuetcwkvzejpooguac.supabase.co'; 
const supabaseKey = 'sb_publishable_k1IJsKmejk4jmqpNReSPfg_fJ1I6qsS';

// Validação básica para evitar erros fatais se os campos estiverem vazios ou forem placeholders
const isValidConfig = supabaseUrl.includes('supabase.co') && !supabaseKey.startsWith('your_');

export const supabase = createClient(
  isValidConfig ? supabaseUrl : 'https://placeholder-url.supabase.co', 
  isValidConfig ? supabaseKey : 'placeholder-key'
);

export const isConfigured = isValidConfig;
