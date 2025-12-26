
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

const supabaseUrl = 'https://ryquxwsaizfirjnbbeks.supabase.co';
const supabaseKey = 'sb_publishable_a7Z-8cOmtHrcS-HxjWhD3w_JAra-jHJ';

export const supabase = createClient(supabaseUrl, supabaseKey);
