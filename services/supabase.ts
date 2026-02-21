import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jlplgaongreladfoidoy.supabase.co'
const supabaseAnonKey = 'sb_publishable_Ipe8mu6KwT0uES58QHG-KQ_a8cY3lPk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)