import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DATABASE_KEY } from '../constants';

export default function useDatabase(
  onLoadDatabase: (database: Record<string, any>) => void,
) {
  const loadDatabase = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(DATABASE_KEY);
      const database = data != null ? JSON.parse(data) : {};
      onLoadDatabase(database);
    } catch (error) {
      console.error('데이터베이스 로드 실패', error);
      onLoadDatabase({});
    }
  }, [onLoadDatabase]);

  const saveDatabase = useCallback(async (database: any) => {
    try {
      await AsyncStorage.setItem(DATABASE_KEY, JSON.stringify(database));
    } catch (error) {
      console.error('데이터베이스 저장 실패:', error);
    }
  }, []);

  const deleteDatabaseItem = useCallback(
    async (data: { id: string }) => {
      try {
        const dbString = await AsyncStorage.getItem(DATABASE_KEY);
        const database = dbString != null ? JSON.parse(dbString) : {};
        delete database[data.id];
        await AsyncStorage.setItem(DATABASE_KEY, JSON.stringify(database));
        onLoadDatabase(database);
      } catch (error) {
        console.error('데이터베이스 삭제 실패:', error);
      }
    },
    [onLoadDatabase],
  );

  return {
    loadDatabase,
    saveDatabase,
    deleteDatabaseItem,
  };
}
