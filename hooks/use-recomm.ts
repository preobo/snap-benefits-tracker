import { useState } from 'react';
import { supabase } from '../services/supabase';

// Defines the structured output you want the AI to return
export type RecommendedFeature = {
  id: string;
  title: string;
  reason: string; 
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
  const [recommendations, setRecommendations] = useState<RecommendedFeature[]>([]);

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

      setRecommendations(data as RecommendedFeature[]);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error occurred while fetching recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, recommendations, getRecommendations };
}