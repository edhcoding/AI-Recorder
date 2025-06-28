import useLocalStorageState from '@/hooks/useLocalStorageState';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type RecorderData = {
  id: string;
  text: string;
  segments: { start: number; end: number; text: string }[];
  summary?: string;
  photos?: string[];
  createdAt: number;
};

type RecorderDatabase = { [id: string]: RecorderData | undefined };

type RecorderContextType = {
  get: ({ id }: { id: string }) => RecorderData | undefined;
  create: (data: RecorderData) => void;
  update: ({ id, summary }: { id: string; summary?: string }) => void;
  getAll: () => RecorderData[];
};

const RecorderContext = createContext<RecorderContextType | undefined>(undefined);

export const RecorderProvider = ({ children }: { children: ReactNode }) => {
  const hasReactNativeWebview = typeof window !== 'undefined' && window.ReactNativeWebView != null;
  const [recorderData, setRecorderData] = useLocalStorageState<RecorderDatabase>('recorderData', {});
  const [loaded, setLoaded] = useState<boolean>(false);

  const get = useCallback(
    ({ id }: { id: string }) => {
      return recorderData[id];
    },
    [recorderData],
  );

  const getAll = useCallback(() => {
    return Object.values(recorderData) as RecorderData[];
  }, [recorderData]);

  const create = useCallback(
    (data: RecorderData) => {
      setRecorderData((prev) => ({ ...prev, [data.id]: data }));
    },
    [setRecorderData],
  );

  const update = useCallback(
    ({ id, summary }: { id: string; summary?: string }) => {
      setRecorderData((prev) => {
        const prevData = prev[id];
        if (prevData == null) return prev;

        return {
          ...prev,
          [id]: {
            ...prevData,
            ...(summary != null ? { summary } : {}),
          },
        };
      });
    },
    [setRecorderData],
  );

  // const remove = useCallback(({ id }: { id: string }) => {}, []);

  useEffect(() => {
    if (!loaded && hasReactNativeWebview)
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'load-database' }));
  }, [hasReactNativeWebview, loaded]);

  useEffect(() => {
    if (loaded && hasReactNativeWebview)
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'save-database', data: recorderData }));
  }, [loaded, hasReactNativeWebview, recorderData]);

  useEffect(() => {
    if (hasReactNativeWebview) {
      const handleMessage = (event: any) => {
        const { type, data } = JSON.parse(event.data);

        if (type === 'onLoadDatabase') {
          setRecorderData(data);
          setLoaded(true);
        }
      };

      window.addEventListener('message', handleMessage);
      document.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
        document.removeEventListener('message', handleMessage);
      };
    }
  }, [hasReactNativeWebview, setRecorderData]);

  return <RecorderContext.Provider value={{ get, getAll, create, update }}>{children}</RecorderContext.Provider>;
};

export const useRecorderContext = () => {
  const context = useContext(RecorderContext);

  if (context === undefined) throw new Error('useRecorderContext must be used within a RecorderProvider');

  return context;
};
