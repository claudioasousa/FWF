
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

const supabaseUrl = 'https://fpuetcwkvzejpooguac.supabase.co';
const supabaseKey = 'sb_publishable_k1IJsKmejk4jmqpNReSPfg_fJ1I6qsS';

export const supabase = createClient(supabaseUrl, supabaseKey);
