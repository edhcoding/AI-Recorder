import transcribeAudio from '@/apis/transcribe';
import { TOAST_SUCCESS_MESSAGES } from '@/constants/toast';
import { useRecorderContext } from '@/contexts/RecorderContext';
import { useToast } from '@/hooks/useToast';
import base64ToBlob from '@/utils/base64ToBlob';
import { generateUuid } from '@/utils/generateUuid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useRecorder() {
  const [recordState, setRecordState] = useState<'recording' | 'paused' | null>(null);
  const [time, setTime] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  console.log('audioUrl', audioUrl);
  console.log('photos', photos);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const navigate = useNavigate();

  const { showToast } = useToast();
  const { create } = useRecorderContext();

  const hasReactNativeWebview = typeof window !== 'undefined' && window.ReactNativeWebView != null;

  // RN 메시지 전송 함수
  const postMessageToRN = useCallback((type: string, data?: any) => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type, data }));
  }, []);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onPauseRecord = useCallback(() => {
    if (hasReactNativeWebview) {
      postMessageToRN('pause-record');
      return;
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.pause();
      stopTimer();
    }
  }, [hasReactNativeWebview, postMessageToRN, stopTimer]);

  const onResumeRecord = useCallback(() => {
    if (hasReactNativeWebview) {
      postMessageToRN('resume-record');
      return;
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.resume();
      startTimer();
    }
  }, [hasReactNativeWebview, postMessageToRN, startTimer]);

  const onTranscibeAudio = useCallback(
    async (url: string, ext?: string) => {
      if (!url) return;

      try {
        showToast('success', '음성을 처리하고 있습니다...');

        const response = await fetch(url);
        const audioBlob = await response.blob();
        const { text, segments } = await transcribeAudio(audioBlob, ext);
        const id = generateUuid();

        create({ id, text, segments, photos: [] });
        showToast('success', '녹음이 저장되었습니다.');
        navigate(`/recorder/${id}`);
      } catch (error) {
        console.error('Transcription error:', error);
        showToast('error', '음성 변환에 실패했습니다.');
      }
    },
    [create, navigate, showToast],
  );

  const onStopRecord = useCallback(
    ({ url, ext }: { url: string; ext?: string }) => {
      setAudioUrl(url);
      setRecordState(null);
      stopTimer();
      showToast('success', TOAST_SUCCESS_MESSAGES.SAVE_RECORD);
      onTranscibeAudio(url, ext);
    },
    [onTranscibeAudio, showToast, stopTimer],
  );

  const onPressSave = useCallback(async () => {
    if (hasReactNativeWebview) {
      postMessageToRN('stop-record');
      return;
    }

    if (!audioUrl) {
      showToast('error', '녹음이 완료되지 않았습니다.');
      return;
    }

    if (mediaRecorderRef.current != null) mediaRecorderRef.current.stop();
  }, [audioUrl, hasReactNativeWebview, postMessageToRN, showToast]);

  const record = useCallback(async () => {
    if (hasReactNativeWebview) {
      postMessageToRN('start-record');
      return;
    }

    try {
      const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.onstart = () => {
        setRecordState('recording');
        startTimer();
        showToast('success', TOAST_SUCCESS_MESSAGES.RESUME_RECORD);
      };
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0]?.type });
        audioChunksRef.current = [];
        const url = URL.createObjectURL(blob);
        onStopRecord({ url });
        stream.getAudioTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
    } catch (e) {
      console.error(e);
      showToast('error', '녹음 권한을 허용해주세요');
    }
  }, [hasReactNativeWebview, onStopRecord, postMessageToRN, showToast, startTimer]);

  const onPressRecord = useCallback(() => {
    if (recordState === 'recording') {
      onPauseRecord();
      setRecordState('paused');
      showToast('success', TOAST_SUCCESS_MESSAGES.PAUSE_RECORD);
    } else if (recordState === 'paused') {
      onResumeRecord();
      setRecordState('recording');
      showToast('success', TOAST_SUCCESS_MESSAGES.RESUME_RECORD);
    } else record();
  }, [onPauseRecord, onResumeRecord, record, recordState, showToast]);

  useEffect(() => {
    if (hasReactNativeWebview) {
      // RN 메시지 수신 함수
      const handleMessage = (event: any) => {
        console.log('web handleMessage event', event);
        const { type, data } = JSON.parse(event.data);
        console.log('RN  메시지 수신 type', type);
        console.log('RN  메시지 수신 data', data);

        if (type === 'onStartRecord') {
          setRecordState('recording');
          startTimer();
          showToast('success', TOAST_SUCCESS_MESSAGES.RESUME_RECORD);
        } else if (type === 'onStopRecord') {
          const { audio, mimeType, ext } = data;
          const blob = base64ToBlob(audio, mimeType);
          const url = URL.createObjectURL(blob);
          onStopRecord({ url, ext });
          setRecordState(null);
        } else if (type === 'onPauseRecord') {
          setRecordState('paused');
          stopTimer();
          showToast('success', TOAST_SUCCESS_MESSAGES.PAUSE_RECORD);
        } else if (type === 'onResumeRecord') {
          setRecordState('recording');
          startTimer();
          showToast('success', TOAST_SUCCESS_MESSAGES.RESUME_RECORD);
        } else if (type === 'onTakePhoto') {
          setPhotos((prev) => prev.concat([data]));
        }
      };
      // ios, android 모두 메시지 수신
      window.addEventListener('message', handleMessage);
      document.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
        document.removeEventListener('message', handleMessage);
      };
    }
  }, [hasReactNativeWebview, onStopRecord, photos, showToast, startTimer, stopTimer]);

  const onCamera = useCallback(() => {
    postMessageToRN('open-camera');
  }, [postMessageToRN]);

  return {
    recordState,
    time,
    onPressRecord,
    onPressSave,
    onCamera,
  };
}
