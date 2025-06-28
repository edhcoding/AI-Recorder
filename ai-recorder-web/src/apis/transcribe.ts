// OpenAI의 Whisper API로 음성 파일을 텍스트로 변환하고, GPT-4o-mini API로 텍스트를 요약하는 API
export default async function transcribeAudio(audioBlob: Blob) {
  // 1. Speech to Text (음성 파일을 텍스트로 변환)
  const formData = new FormData(); // 폼 데이터
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', 'ko');
  formData.append('response_format', 'verbose_json');

  const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!transcriptionResponse.ok) throw new Error(`Transcription failed: ${transcriptionResponse.statusText}`);

  const transcriptionData = await transcriptionResponse.json();
  const fullText = transcriptionData.text;

  return {
    text: fullText,
    segments: transcriptionData.segments.map((seg: { start: number; end: number; text: string }) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text.trim(),
    })),
  };
}
