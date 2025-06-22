import { transcribeAndSummarize } from '@/apis/transcribe';
import { TOAST_SUCCESS_MESSAGES } from '@/constants/toast';
import { useToast } from '@/hooks/useToast';
import { useCallback, useRef, useState } from 'react';

export default function useRecorder() {
  const [recordState, setRecordState] = useState<'recording' | 'paused' | null>(null);
  const [time, setTime] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<{
    text: string;
    segments: { start: number; end: number; text: string }[];
  } | null>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const { showToast } = useToast();

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

  const onStopRecord = useCallback(
    ({ url }: { url: string }) => {
      setAudioUrl(url);
      setRecordState(null);
      stopTimer();
      showToast('success', TOAST_SUCCESS_MESSAGES.SAVE_RECORD);
    },
    [showToast, stopTimer],
  );

  const onPressSave = useCallback(() => {
    if (mediaRecorderRef.current != null) mediaRecorderRef.current.stop();
  }, []);

  const record = useCallback(async () => {
    try {
      const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.onstart = () => startTimer();
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
      setRecordState('recording');
      record();
      showToast('success', TOAST_SUCCESS_MESSAGES.RESUME_RECORD);
    }
  }, [onPauseRecord, onResumeRecord, record, recordState, showToast]);

  const transcribeAndSummarizeHandler = useCallback(async () => {
    if (!audioUrl) {
      showToast('error', '녹음 파일이 없습니다.');
      return;
    }

    try {
      setIsTranscribing(true);
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      const result = await transcribeAndSummarize(audioBlob);
      setTranscriptionResult(result.transcription);
      setSummaryResult(result.summary);
      showToast('success', '음성이 요약되었습니다.');
    } catch (error) {
      console.error('Transcription error:', error);
      showToast('error', '음성 요약에 실패했습니다.');
    } finally {
      setIsTranscribing(false);
    }
  }, [audioUrl, showToast]);

  return {
    recordState,
    time,
    audioUrl,
    onPressRecord,
    onPressSave,
    summaryResult,
    transcriptionResult,
    isTranscribing,
    transcribeAndSummarizeHandler,
  };
}
