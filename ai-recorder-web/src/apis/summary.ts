// OpenAI의 Whisper API로 음성 파일을 텍스트로 변환하고, GPT-4o-mini API로 텍스트를 요약하는 API
export default async function summaryText(text: string) {
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
          content: `다음 내용을 최대한 간결하고 명확하게 요약해주세요: ${text}`,
        },
      ],
      max_completion_tokens: 500,
    }),
  });

  if (!summaryResponse.ok) throw new Error(`Summary failed: ${summaryResponse.statusText}`);

  const summaryData = await summaryResponse.json();
  const summary = summaryData.choices[0].message.content;

  return summary;
}
