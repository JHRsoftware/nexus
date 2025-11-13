'use client';

import { useState, useCallback, useMemo } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export const useLoading = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const startLoading = useCallback((key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((key: string) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.keys(loadingStates).length > 0;
  }, [loadingStates]);

  const clearAll = useCallback(() => {
    setLoadingStates({});
  }, []);

  const loadingKeys = useMemo(() => Object.keys(loadingStates), [loadingStates]);

  return {
    startLoading,
    stopLoading,
    isLoading,
    clearAll,
    loadingKeys,
    loadingStates
  };
};

export default useLoading;