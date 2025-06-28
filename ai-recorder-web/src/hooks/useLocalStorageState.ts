import { useState, useEffect, useCallback } from 'react';

export default function useLocalStorageState<T>(key: string, defaultValue: T) {
  const hasReactNativeWebview = typeof window !== 'undefined' && window.ReactNativeWebView != null;

  const [state, setState] = useState<T>(() => {
    if (!hasReactNativeWebview) {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (!hasReactNativeWebview) localStorage.setItem(key, JSON.stringify(state));
  }, [hasReactNativeWebview, key, state]);

  const updateState = useCallback((newState: T | ((prevState: T) => T)) => {
    setState(newState);
  }, []);

  return [state, updateState] as const;
}
