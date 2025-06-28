import summaryText from '@/apis/summary';
import PageLayout from '@/components/PageLayout';
import { useRecorderContext, type RecorderData } from '@/contexts/RecorderDataContext';
import useFunnel from '@/hooks/useFunnel';
import { useToast } from '@/hooks/useToast';
import { formatTime } from '@/utils/formatTime';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function RecorderDetailPage() {
  const { recorderId } = useParams();
  const { get, update } = useRecorderContext();

  const [recorderData, setRecorderData] = useState<RecorderData | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  const { Funnel, Step, currentStep, nextClickHandler, prevClickHandler } = useFunnel('음성기록');
  const { showToast } = useToast();

  const onClickSummarize = useCallback(async () => {
    if (!recorderData || !recorderId) return;

    setIsSummarizing(true);
    try {
      const fullText = recorderData.text;
      const summary = await summaryText(fullText);

      if (summary) {
        update({ id: recorderId, summary });
        showToast('success', '요약이 생성되었습니다.');
        nextClickHandler('요약');
      }
    } catch (error) {
      console.error('Summary error:', error);
      showToast('error', '요약 생성에 실패했습니다.');
    } finally {
      setIsSummarizing(false);
    }
  }, [nextClickHandler, recorderData, recorderId, showToast, update]);

  useEffect(() => {
    if (recorderId) {
      const data = get({ id: recorderId });
      if (data != null) return setRecorderData(data);
      else throw new Error('RecorderData not found');
    }
  }, [get, recorderId]);

  return (
    <PageLayout
      headerProps={{
        title: `${currentStep}`,
        showBackButton: true,
        showLogo: false,
        showTitle: true,
        showDetailCamera: true,
      }}
    >
      <div className="flex flex-col flex-1 overflow-auto">
        <Funnel>
          <Step name="음성기록">
            <div className="flex py-2">
              <button type="button" className="flex-1 py-2 border-b-2 border-b-primary cursor-pointer">
                음성기록
              </button>
              <button type="button" onClick={() => nextClickHandler('요약')} className="flex-1 py-2 cursor-pointer">
                요약
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center overflow-y-scroll">
              <button
                type="button"
                disabled={isSummarizing}
                onClick={onClickSummarize}
                className="bg-primary relative flex items-center justify-center py-2 mt-2 text-white w-full rounded-lg cursor-pointer"
              >
                {isSummarizing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    <div>요약중...</div>
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2 text-white">smart_toy</span> AI 요약하기
                    <span className="material-icons absolute right-4 text-3xl!">arrow_right_alt</span>
                  </>
                )}
              </button>
              <div className="flex flex-col w-full gap-4 overflow-y-scroll">
                {recorderData?.segments.map((item, index) => (
                  <div key={index} className="flex flex-col w-full mt-4 gap-2">
                    <div className="text-sm font-medium">
                      {formatTime(item.start)}-{formatTime(item.end)}
                    </div>
                    <div className="border p-2 text-pretty">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </Step>
          <Step name="요약">
            <div className="flex py-2">
              <button type="button" onClick={() => prevClickHandler('음성기록')} className="flex-1 py-2 cursor-pointer">
                음성기록
              </button>
              <button type="button" className="flex-1 py-2 border-b-2 border-b-primary cursor-pointer">
                요약
              </button>
            </div>
            {recorderData?.summary ? (
              <div className="py-2 flex flex-col gap-2">
                <div className="flex items-center gap-1 font-medium">
                  <span className="material-icons text-2xl! text-primary">smart_toy</span> AI 요약 결과
                </div>
                <p className="border p-2 text-pretty">{recorderData.summary}</p>
              </div>
            ) : (
              <div className="flex flex-col flex-1 items-center justify-center text-center text-xl">
                <span className="material-icons text-5xl! mb-2 text-primary">rocket_launch</span>
                <span>요약된 내용이 없습니다.</span>
                <span>요약을 생성해주세요.</span>
              </div>
            )}
          </Step>
        </Funnel>
      </div>
    </PageLayout>
  );
}
