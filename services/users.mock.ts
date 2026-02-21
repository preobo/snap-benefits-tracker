export const getUser = async (id: string) => {
  // We wrap this in an object with 'data' and 'error' to match Supabase's return style
  return { 
    data: {
      id: 'demo-user',
      monthly_snap_budget: 300,
      household_size: 3,
      preferences: 'Vegetarian, No Peanuts'
    }, 
    error: null 
  };
};

export const updateUser = async (id: string, updates: any) => {
  console.log('HACKATHON LOG: Mocking update with:', updates);
  return { data: updates, error: null };
};