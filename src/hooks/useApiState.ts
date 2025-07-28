import { useState, useCallback } from "react";

interface ApiState {
  loading: boolean;
  error: string;
}

interface UseApiStateReturn extends ApiState {
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  resetError: () => void;
  executeWithLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

export const useApiState = (): UseApiStateReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetError = useCallback(() => {
    setError("");
  }, []);

  const executeWithLoading = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T> => {
      setLoading(true);
      setError("");

      try {
        const result = await asyncFn();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    setLoading,
    setError,
    resetError,
    executeWithLoading,
  };
};
