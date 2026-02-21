import * as mock from './users.mock';
import { supabase } from './supabase';
import { USE_MOCK } from './backend';

export const getUser = async (id: string) => {
  if (USE_MOCK) return mock.getUser(id);

  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const updateUser = async (id: string, updates: any) => {
  if (USE_MOCK) return mock.updateUser(id, updates);

  try {
    const { data, error } = await supabase.from('users').update(updates).eq('id', id);
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};