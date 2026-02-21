import { supabase } from './supabase'

export async function testConnection() {
  const { data, error } = await supabase.from('users').select('*')

  console.log('DATA:', data)
  console.log('ERROR:', error)

  const res = await fetch('https://jplgaongreladfoidoy.supabase.co')
console.log('FETCH STATUS:', res.status)
}