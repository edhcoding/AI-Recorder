import { Platform, SafeAreaView } from 'react-native';
import WebView from 'react-native-webview';
import { styles } from './styles';
import { useCallback, useRef } from 'react';

export default function App() {
  const webViewRef = useRef<WebView | null>(null);

  const sendMessageToWebView = useCallback((type: string, data?: any) => {
    const message = JSON.stringify({ type, data });
    webViewRef.current?.postMessage(message);
  }, []);

  const startRecord = useCallback(() => {
    // TODO: 녹음 시작
    console.log('start-record');
    sendMessageToWebView('onStartRecord');
  }, [sendMessageToWebView]);

  const stopRecord = useCallback(() => {
    // TODO: 오디오 파일 생성 -> sendMessageToWebView로 보내주기
    console.log('stop-record');
    const data = {};
    sendMessageToWebView('onStopRecord', data);
  }, [sendMessageToWebView]);

  const pauseRecord = useCallback(() => {
    // TODO: 녹음 일시정지
    console.log('pause-record');
    sendMessageToWebView('onPauseRecord');
  }, [sendMessageToWebView]);

  const resumeRecord = useCallback(() => {
    // TODO: 녹음 재생
    console.log('resume-record');
    sendMessageToWebView('onResumeRecord');
  }, [sendMessageToWebView]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        ref={webViewRef}
        source={{
          uri:
            Platform.OS === 'android'
              ? 'http://172.30.34.17:5173'
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
          }
        }}
        webviewDebuggingEnabled={true}
      />
    </SafeAreaView>
  );
}
