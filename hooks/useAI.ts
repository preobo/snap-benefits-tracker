import { useState } from 'react';

type AIResponse = {
  text: string;
};

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIResponse | null>(null);

  const callAI = async (prompt: string) => {
    setLoading(true);
    setError(null);

    try {
        //replace this with the real API endpoint
      const res = await fetch('https://your-backend-url.com/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = (await res.json()) as AIResponse;
      setResult(data);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, result, callAI };
}
