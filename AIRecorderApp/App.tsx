import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import { styles } from './styles';
import { useCallback, useRef, useState } from 'react';
import AudioRecorderPlayer, {
  AVEncodingOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import Permission from 'react-native-permissions';
import RNFS from 'react-native-fs';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

export default function App() {
  const cameraRef = useRef<Camera | null>(null);
  const webViewRef = useRef<WebView | null>(null);
  const audioRecorderPlayerRef = useRef<AudioRecorderPlayer>(
    new AudioRecorderPlayer(),
  );
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const device = useCameraDevice('back');

  const sendMessageToWebView = useCallback((type: string, data?: any) => {
    const message = JSON.stringify({ type, data });
    webViewRef.current?.postMessage(message);
  }, []);

  const startRecord = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await Permission.requestMultiple([
          Permission.PERMISSIONS.ANDROID.RECORD_AUDIO,
        ]);

        if (
          grants[Permission.PERMISSIONS.ANDROID.RECORD_AUDIO] ===
          Permission.RESULTS.GRANTED
        ) {
          console.log('권한 획득 성공');
        } else {
          console.log('권한 획득 실패');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    } else if (Platform.OS === 'ios') {
      try {
        const grants = await Permission.requestMultiple([
          Permission.PERMISSIONS.IOS.MICROPHONE,
        ]);

        if (
          grants[Permission.PERMISSIONS.IOS.MICROPHONE] ===
          Permission.RESULTS.GRANTED
        ) {
          console.log('권한 획득 성공');
        } else {
          console.log('권한 획득 실패');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    await audioRecorderPlayerRef.current.startRecorder(undefined, {
      AVFormatIDKeyIOS: AVEncodingOption.mp4, // ios 녹음 포맷, 기본으로 권한 요청 지원
      OutputFormatAndroid: OutputFormatAndroidType.MPEG_4, // android 녹음 포멧, 권한 요청 필요
    });

    sendMessageToWebView('onStartRecord');
  }, [sendMessageToWebView]);

  const stopRecord = useCallback(async () => {
    const filepath = await audioRecorderPlayerRef.current.stopRecorder();
    const ext = filepath.split('.').pop();
    const base64audio = await RNFS.readFile(filepath, 'base64');

    sendMessageToWebView('onStopRecord', {
      audio: base64audio,
      mimeType: 'audio/mp4',
      ext,
    });
  }, [sendMessageToWebView]);

  const pauseRecord = useCallback(async () => {
    await audioRecorderPlayerRef.current.pauseRecorder();

    sendMessageToWebView('onPauseRecord');
  }, [sendMessageToWebView]);

  const resumeRecord = useCallback(async () => {
    await audioRecorderPlayerRef.current.resumeRecorder();

    sendMessageToWebView('onResumeRecord');
  }, [sendMessageToWebView]);

  const openCamera = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'granted') {
      console.log('카메라 권한 획득 성공');
      setIsCameraOpen(true);
    } else {
      console.log('카메라 권한 획득 실패');
      setIsCameraOpen(false);
    }
  }, []);

  const closeCamera = useCallback(() => {
    setIsCameraOpen(false);
  }, []);

  const onPressPhotoButton = useCallback(async () => {
    const file = await cameraRef.current?.takePhoto({
      flash: 'off',
    });

    if (file != null) {
      const base64Image = await RNFS.readFile(file.path, 'base64');
      // data:[<MIME-type>][;base64],<data> 형식으로 변환
      const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

      sendMessageToWebView('onTakePhoto', imageDataUrl);
    }
  }, [sendMessageToWebView]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        ref={webViewRef}
        source={{
          uri:
            Platform.OS === 'android'
              ? 'http://172.30.34.25:5173'
              : 'http://localhost:5173',
        }}
        onMessage={event => {
          console.log('event.nativeEvent.data', event.nativeEvent.data);
          const { type } = JSON.parse(event.nativeEvent.data);

          if (type === 'start-record') {
            startRecord();
          } else if (type === 'stop-record') {
            stopRecord();
          } else if (type === 'pause-record') {
            pauseRecord();
          } else if (type === 'resume-record') {
            resumeRecord();
          } else if (type === 'open-camera') {
            openCamera();
          }
        }}
        webviewDebuggingEnabled={true}
      />
      {isCameraOpen && device != null && (
        <View style={styles.camera}>
          <Camera
            photo
            isActive
            ref={cameraRef}
            device={device}
            photoQualityBalance="speed"
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity
            style={styles.cameraCloseButton}
            onPress={closeCamera}
          >
            <Text style={styles.cameraCloseText}>CLOSE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraPhotoButton}
            onPress={onPressPhotoButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
