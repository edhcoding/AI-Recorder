import { Platform } from 'react-native';
import Permission from 'react-native-permissions';

export default async function requestPermission(): Promise<boolean> {
  try {
    let grants: Record<string, string>;

    if (Platform.OS === 'android') {
      grants = await Permission.requestMultiple([
        Permission.PERMISSIONS.ANDROID.RECORD_AUDIO,
      ]);

      return (
        grants[Permission.PERMISSIONS.ANDROID.RECORD_AUDIO] ===
        Permission.RESULTS.GRANTED
      );
    } else if (Platform.OS === 'ios') {
      grants = await Permission.requestMultiple([
        Permission.PERMISSIONS.IOS.MICROPHONE,
      ]);

      return (
        grants[Permission.PERMISSIONS.IOS.MICROPHONE] ===
        Permission.RESULTS.GRANTED
      );
    }

    return false;
  } catch (err) {
    console.warn('권한 요청 중 오류 발생:', err);
    return false;
  }
}
