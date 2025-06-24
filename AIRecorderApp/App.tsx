import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { styles } from './styles';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        source={{
          uri:
            Platform.OS === 'android'
              ? 'http://172.30.34.17:5173'
              : 'http://localhost:5173',
        }}
      />
    </SafeAreaView>
  );
}
