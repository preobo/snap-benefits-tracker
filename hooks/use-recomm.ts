import { useState } from 'react';
import { supabase } from '../services/supabase';

// Defines the structured output you want the AI to return
export type GroceryItem = {
  id: string;
  name: string;
  subName: string;
  checked: boolean;
};
export type Meal = { type: string; name: string; };
export type DailyPlan = { day: string; meals: Meal[]; };

export type AIMasterResponse = {
  mealPlan: DailyPlan[];
  groceryList: GroceryCategory[];
};

export type GroceryCategory = {
  category: string;
  items: GroceryItem[];
};
// Defines the structured input from your onboarding screens
export type UserOnboardingData = {
  parentName: string;
  childrenCount: number;
  budget: string;
  reloadTime: string;
  priorities: string[];
  dietaryRestrictions: string[];
};

export function useRecommendationEngine() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 2. Tell React to expect an array of GroceryCategories
  const [recommendations, setRecommendations] = useState<AIMasterResponse | null>(null);

  const getRecommendations = async (userData: UserOnboardingData) => {
    setLoading(true);
    setError(null);

    try {
      // 2. Use Supabase to securely call your AI Edge Function
      // 'recommend-ai' is the name of the function we will create on your backend
      const { data, error: supabaseError } = await supabase.functions.invoke('recommend-ai', {
        body: { userData },
      });

      // 3. Handle any errors returned specifically by Supabase
      if (supabaseError) {
        throw new Error(`Supabase Error: ${supabaseError.message}`);
      }

      setRecommendations(data as AIMasterResponse);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error occurred while fetching recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, recommendations, getRecommendations };
}