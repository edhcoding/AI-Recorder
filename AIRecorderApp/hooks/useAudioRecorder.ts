import { useCallback, useRef } from 'react';
import AudioRecorderPlayer, {
  AVEncodingOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import requestPermission from '../utils/permissions';
import RNFS from 'react-native-fs';

export default function useAudioRecorder(
  onStartRecord: () => void,
  onStopRecord: (data: { audio: string; mimeType: string }) => void,
  onPauseRecord: () => void,
  onResumeRecord: () => void,
) {
  const audioRecorderPlayerRef = useRef<AudioRecorderPlayer>(
    new AudioRecorderPlayer(),
  );

  const startRecord = useCallback(async () => {
    const hasPermission = await requestPermission();

    if (!hasPermission) {
      console.log('오디오 권한 획득 실패');
      return;
    }

    await audioRecorderPlayerRef.current.startRecorder(undefined, {
      AVFormatIDKeyIOS: AVEncodingOption.mp4,
      OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
    });

    onStartRecord();
  }, [onStartRecord]);

  const stopRecord = useCallback(async () => {
    try {
      const filepath = await audioRecorderPlayerRef.current.stopRecorder();
      const base64audio = await RNFS.readFile(filepath, 'base64');

      onStopRecord({
        audio: base64audio,
        mimeType: 'audio/mp4',
      });
    } catch (error) {
      console.error('녹음 중지 실패:', error);
    }
  }, [onStopRecord]);

  const pauseRecord = useCallback(async () => {
    try {
      await audioRecorderPlayerRef.current.pauseRecorder();
      onPauseRecord();
    } catch (error) {
      console.error('녹음 일시정지 실패:', error);
    }
  }, [onPauseRecord]);

  const resumeRecord = useCallback(async () => {
    try {
      await audioRecorderPlayerRef.current.resumeRecorder();
      onResumeRecord();
    } catch (error) {
      console.error('녹음 재개 실패:', error);
    }
  }, [onResumeRecord]);

  return {
    startRecord,
    stopRecord,
    pauseRecord,
    resumeRecord,
  };
}
