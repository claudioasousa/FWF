
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = 'https://vibmmexedzoasehemkkr.supabase.co';
const supabaseAnonKey = 'sb_publishable_wW4D0MiSJuQxPuSwMO9yTw_Vu087u7j';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
