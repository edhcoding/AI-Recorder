import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import { styles } from './styles';
import { useCallback, useRef } from 'react';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { WEBVIEW_URL } from './constants';
import useAudioRecorder from './hooks/useAudioRecorder';
import useCamera from './hooks/useCamera';
import useDatabase from './hooks/useDatabase';

export default function App() {
  const webViewRef = useRef<WebView | null>(null);

  const device = useCameraDevice('back');

  const sendMessageToWebView = useCallback((type: string, data?: any) => {
    const message = JSON.stringify({ type, data });
    console.log('message', message);
    webViewRef.current?.postMessage(message);
  }, []);

  const { startRecord, stopRecord, pauseRecord, resumeRecord } =
    useAudioRecorder(
      () => sendMessageToWebView('onStartRecord'),
      data => sendMessageToWebView('onStopRecord', data),
      () => sendMessageToWebView('onPauseRecord'),
      () => sendMessageToWebView('onResumeRecord'),
    );

  const { cameraRef, isCameraOpen, openCamera, closeCamera, takePhoto } =
    useCamera(imageDataUrl =>
      sendMessageToWebView('onTakePhoto', imageDataUrl),
    );

  const { loadDatabase, saveDatabase, deleteDatabaseItem } = useDatabase(
    database => sendMessageToWebView('onLoadDatabase', database),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        ref={webViewRef}
        source={{
          uri: WEBVIEW_URL,
        }}
        onMessage={event => {
          const { type, data } = JSON.parse(event.nativeEvent.data);

          if (type === 'start-record') startRecord();
          else if (type === 'stop-record') stopRecord();
          else if (type === 'pause-record') pauseRecord();
          else if (type === 'resume-record') resumeRecord();
          else if (type === 'open-camera') openCamera();
          else if (type === 'load-database') loadDatabase();
          else if (type === 'save-database') saveDatabase(data);
          else if (type === 'delete-database') deleteDatabaseItem(data);
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
            onPress={takePhoto}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
