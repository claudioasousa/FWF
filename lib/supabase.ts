
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = 'https://uzxurocllrokjmsmuiau.supabase.co';
const supabaseAnonKey = 'sb_publishable_MxpKzB8xsyp_rLjO8NYNIQ_r756OFM3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
