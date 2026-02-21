import { useState } from 'react';

// Defines the structured output you want the AI to return
export type RecommendedFeature = {
  id: string;
  title: string;
  reason: string; 
};

// Defines the structured input from your onboarding screens
export type UserOnboardingData = {
  householdSize: number;
  primaryGoal: string;
  needsImmediateAssistance: boolean;
};

export function useRecommendationEngine() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedFeature[]>([]);

  const getRecommendations = async (userData: UserOnboardingData) => {
    setLoading(true);
    setError(null);

    try {
      // Replace this with your actual backend endpoint
      const res = await fetch('https://your-backend-url.com/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData }), 
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = (await res.json()) as RecommendedFeature[];
      setRecommendations(data);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, recommendations, getRecommendations };
}