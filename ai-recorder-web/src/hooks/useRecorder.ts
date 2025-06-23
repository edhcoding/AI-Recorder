// import { transcribeAndSummarize } from '@/apis/transcribe';
import transcribeAudio from '@/apis/transcribe';
import { TOAST_SUCCESS_MESSAGES } from '@/constants/toast';
import { useRecorderContext } from '@/contexts/RecorderContext';
import { useToast } from '@/hooks/useToast';
import { generateUuid } from '@/utils/generateUuid';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useRecorder() {
  const [recordState, setRecordState] = useState<'recording' | 'paused' | null>(null);
  const [time, setTime] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const navigate = useNavigate();

  const { showToast } = useToast();
  const { create } = useRecorderContext();

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
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.pause();
      stopTimer();
    }
  }, [stopTimer]);

  const onResumeRecord = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.resume();
      startTimer();
    }
  }, [startTimer]);

  const onTranscibeAudio = useCallback(
    async (url: string) => {
      if (!url) return;

      try {
        showToast('success', '음성을 처리하고 있습니다...');

        const response = await fetch(url);
        const audioBlob = await response.blob();
        const { text, segments } = await transcribeAudio(audioBlob);
        const id = generateUuid();

        create({ id, text, segments });
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
    ({ url }: { url: string }) => {
      setAudioUrl(url);
      setRecordState(null);
      stopTimer();
      showToast('success', TOAST_SUCCESS_MESSAGES.SAVE_RECORD);
      onTranscibeAudio(url);
    },
    [onTranscibeAudio, showToast, stopTimer],
  );

  const onPressSave = useCallback(async () => {
    if (!audioUrl) {
      showToast('error', '녹음이 완료되지 않았습니다.');
      return;
    }

    if (mediaRecorderRef.current != null) mediaRecorderRef.current.stop();
  }, [audioUrl, showToast]);

  const record = useCallback(async () => {
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
        const blob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0].type });
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
  }, [onStopRecord, showToast, startTimer]);

  const onPressRecord = useCallback(() => {
    if (recordState === 'recording') {
      onPauseRecord();
      setRecordState('paused');
      showToast('success', TOAST_SUCCESS_MESSAGES.PAUSE_RECORD);
    } else if (recordState === 'paused') {
      onResumeRecord();
      setRecordState('recording');
      showToast('success', TOAST_SUCCESS_MESSAGES.RESUME_RECORD);
    } else {
      record();
    }
  }, [onPauseRecord, onResumeRecord, record, recordState, showToast]);

  return {
    recordState,
    time,
    onPressRecord,
    onPressSave,
  };
}
