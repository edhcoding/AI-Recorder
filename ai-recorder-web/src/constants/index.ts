// React Native Webview 객체가 window에 존재하는지 확인
export const hasReactNativeWebview = typeof window !== 'undefined' && window.ReactNativeWebView != null;
