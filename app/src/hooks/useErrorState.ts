import { useState } from "react";

export const useErrorState = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearError = () => setError("");
  const clearLoading = () => setLoading(false);

  return {
    error,
    setError,
    loading,
    setLoading,
    clearError,
    clearLoading,
  };
};
