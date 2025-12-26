
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = 'https://uzxurocllrokjmsmuiau.supabase.co';
// Utilizando a chave do ambiente conforme as diretrizes
const supabaseAnonKey = process.env.API_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
