// Input -> audio
// OpenAI audio -> text
// Output -> text

// OpenAI의 Whisper API로 음성 파일을 텍스트로 변환하고, GPT-4o-mini API로 텍스트를 요약하는 API
export const transcribeAndSummarize = async (audioBlob: Blob) => {
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

  // 2. Text to Summary (텍스트 요약)
  const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '음성 데이터를 간결하고 명확하게 요약해주세요. 핵심 내용만 추출하여 정리해주세요.',
        },
        {
          role: 'user',
          content: `다음 음성 내용을 요약해주세요: ${fullText}`,
        },
      ],
      max_completion_tokens: 500,
    }),
  });

  if (!summaryResponse.ok) throw new Error(`Summary failed: ${summaryResponse.statusText}`);

  const summaryData = await summaryResponse.json();
  const summary = summaryData.choices[0].message.content;

  return {
    // 음성 파일을 텍스트로 변환한 결과
    transcription: {
      text: fullText,
      segments: transcriptionData.segments.map((seg: { start: number; end: number; text: string }) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text.trim(),
      })),
    },
    // 텍스트 요약 결과
    summary: summary,
  };
};
